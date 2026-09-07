begin;

create table careers_private.email_verifications (
  email text primary key,
  challenge_id uuid not null unique,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  consumed boolean not null default false,
  sent_at timestamptz not null default now(),
  window_started_at timestamptz not null default now(),
  sends_in_window integer not null default 1
);
alter table careers_private.email_verifications enable row level security;
revoke all on careers_private.email_verifications from public, anon, authenticated;
grant select, insert, update, delete on careers_private.email_verifications to service_role;

create function public.request_careers_email_code(p_email text, p_challenge_id uuid, p_code_hash text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare previous careers_private.email_verifications;
begin
  -- Serialize requests for an address across server instances.
  perform pg_advisory_xact_lock(hashtextextended(lower(p_email), 0));
  select * into previous from careers_private.email_verifications where email = lower(p_email) for update;
  if found and (previous.sent_at > now() - interval '60 seconds'
    or (previous.window_started_at > now() - interval '1 hour' and previous.sends_in_window >= 5)) then
    return false;
  end if;
  insert into careers_private.email_verifications
    (email, challenge_id, code_hash, expires_at, attempts, consumed, sent_at, window_started_at, sends_in_window)
  values (lower(p_email), p_challenge_id, p_code_hash, now() + interval '10 minutes', 0, false, now(),
    case when previous.window_started_at > now() - interval '1 hour' then previous.window_started_at else now() end,
    case when previous.window_started_at > now() - interval '1 hour' then previous.sends_in_window + 1 else 1 end)
  on conflict (email) do update set
    challenge_id = excluded.challenge_id, code_hash = excluded.code_hash, expires_at = excluded.expires_at,
    attempts = 0, consumed = false, sent_at = excluded.sent_at,
    window_started_at = excluded.window_started_at, sends_in_window = excluded.sends_in_window;
  return true;
end;
$$;

create function public.verify_careers_email_code(p_challenge_id uuid, p_code_hash text)
returns text language plpgsql security invoker set search_path = '' as $$
declare challenge careers_private.email_verifications;
begin
  select * into challenge from careers_private.email_verifications
    where challenge_id = p_challenge_id for update;
  if not found or challenge.consumed or challenge.expires_at <= now() or challenge.attempts >= 5 then
    return null;
  end if;
  update careers_private.email_verifications set attempts = attempts + 1
    where challenge_id = p_challenge_id;
  if challenge.code_hash <> p_code_hash then return null; end if;
  update careers_private.email_verifications set consumed = true where challenge_id = p_challenge_id;
  return challenge.email;
end;
$$;

revoke all on function public.request_careers_email_code(text, uuid, text) from public, anon, authenticated;
revoke all on function public.verify_careers_email_code(uuid, text) from public, anon, authenticated;
grant execute on function public.request_careers_email_code(text, uuid, text) to service_role;
grant execute on function public.verify_careers_email_code(uuid, text) to service_role;

commit;
