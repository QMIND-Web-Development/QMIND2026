-- Add the final 2026 research projects from the hiring brief.
-- Existing projects are matched by title so their ids, images, and ownership
-- data are preserved. No prompt text or video link was supplied for these two
-- projects, so the application uses its existing generated fallback prompt.

do $$
declare
  project_data record;
  seed_project_id bigint;
begin
  for project_data in
    select *
    from (values
      (
        'Backboard OpenSource CLI Development'::text,
        array['AI agents', 'TypeScript', 'Bun', 'open source', 'developer tools']::text[],
        'Research'::text,
        'Contribute to an open-source terminal agent for AI-assisted software development.'::text,
        'The project offers hands-on experience with agent orchestration, MCP and skills integrations, permissions, checkpoints, testing, CI, and browser automation in a public TypeScript and Bun codebase.'::text,
        $description$The Company Backboard builds infrastructure for AI coding agents, for teams who want serious control over their models, memory, and deployment instead of being locked into one vendor's black box. Think enterprise-grade AI dev tooling: cloud, private cloud, or fully air-gapped.

The Tool: R-CLI R-CLI is Backboard's open-source terminal agent (TypeScript + Bun). Drop it into a project, tell it what you want done, and it reads files, edits code, runs commands, and tests its own changes, with checkpoints and undo/redo so nothing gets wrecked. It's model-agnostic (Anthropic, OpenAI, Google, OpenRouter), extensible via MCP servers and skills, and it's already competitive on public coding benchmarks.

The Work: Contributors will dig into the actual codebase: Core agent engine — the TypeScript/Bun internals that power file editing, command execution, and reasoning; MCP & skills integrations — expanding what tools and workflows the agent can plug into; Permissions & checkpoints — the safety rails that let users trust an AI touching their code; Testing & CI — lint, typecheck, test suite, benchmarking; Browser/computer-use automation — the experimental frontier of what the agent can control. This is agentic AI, the single hottest area in software right now, and it's a live public repo, so every commit is a portfolio piece.

Who We're Looking For: Builders who want to work inside a real TypeScript codebase, not a toy repo; people curious about how AI agents actually work under the hood — reasoning, tool use, context management; detail-oriented types who'd enjoy owning the permissions/safety layer or the test suite; anyone who likes tinkering with integrations (MCP servers, skills, new tool support); and people who want a public GitHub trail of real contributions to point to for co-op, internships, or full-time roles.$description$,
        array['Mukesh Royal', 'Shaanvir Singh']::text[],
        null::text,
        null::text
      ),
      (
        'Quadcopter Drone Computer Vision'::text,
        array['computer vision', 'drones', 'Jetson', 'obstacle avoidance', 'robotics']::text[],
        'Research'::text,
        'Develop real-time computer vision for obstacle avoidance on a flying quadcopter.'::text,
        'In collaboration with ARA Robotics, the project will use a camera and onboard Jetson computing to help a quadcopter perceive and navigate its surroundings without lidar.'::text,
        $description$In collaboration with ARA Robotics, a Canada-based drone manufacturer, this project is working to give eyes to a Quadcopter Drone.

One camera, no lidar, real-time obstacle avoidance running live on a Jetson mid-flight. Working to beat previous attempts with the newer DAv2 model. We've got the hardware, looking for the right human brains to make it fly.$description$,
        array['Jake Feldman Starosta']::text[],
        null::text,
        null::text
      )
    ) as seed(
      project_title,
      project_tags,
      project_category,
      short_description,
      impact_description,
      full_description,
      project_managers,
      faculty_advisor,
      faculty_advisor_url
    )
  loop
    select p.id
      into seed_project_id
      from public.projects as p
     where p."projectTitle" = project_data.project_title
     order by p.id
     limit 1;

    if seed_project_id is null then
      insert into public.projects (
        "projectTitle",
        tags,
        category,
        "githubUrl",
        "projectImages",
        "shortDescription",
        "impactDescription",
        "fullDescription",
        "pmEmail",
        published,
        year,
        "projectManagers",
        "facultyAdvisor",
        "facultyAdvisorUrl"
      ) values (
        project_data.project_title,
        project_data.project_tags,
        project_data.project_category,
        '',
        '{}'::text[],
        project_data.short_description,
        project_data.impact_description,
        project_data.full_description,
        '',
        true,
        2026,
        project_data.project_managers,
        project_data.faculty_advisor,
        project_data.faculty_advisor_url
      )
      returning id into seed_project_id;
    else
      update public.projects
         set "projectTitle" = project_data.project_title,
             tags = project_data.project_tags,
             category = project_data.project_category,
             "shortDescription" = project_data.short_description,
             "impactDescription" = project_data.impact_description,
             "fullDescription" = project_data.full_description,
             published = true,
             year = 2026,
             "projectManagers" = project_data.project_managers,
             "facultyAdvisor" = project_data.faculty_advisor,
             "facultyAdvisorUrl" = project_data.faculty_advisor_url
       where id = seed_project_id;
    end if;

    insert into public.hiring_project_prompts (project_id, prompt_text, video_url)
    values (seed_project_id, null, null)
    on conflict (project_id) do nothing;
  end loop;
end
$$;
