-- Seed the Vehicle Telematics Modelling Consulting project.
--
-- This migration is safe to re-run. Existing rows are matched by project title
-- so their ids, images, PM login emails, and GitHub links are retained.

do $$
declare
  seed_project_id bigint;
begin
  select p.id
    into seed_project_id
    from public.projects as p
   where p."projectTitle" = 'Vehicle Telematics Modelling'
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
      "facultyAdvisorUrl",
      is_hiring
    ) values (
      'Vehicle Telematics Modelling',
      array['vehicle telematics', 'sensor data', 'signal processing', 'machine learning', 'applied AI']::text[],
      'Consulting',
      '',
      '{}'::text[],
      'Build machine learning models that answer practical questions about how vehicles and telematics devices are moving.',
      'Use real vehicle sensor and engine data to infer reversing, installation quality, and device orientation in messy real-world conditions.',
      $description$Geotab builds the GO device: a small unit that plugs into a vehicle and streams data about how that vehicle is moving — GPS, motion sensors, and information straight from the engine. Millions of them are on the road.

This team will build machine learning models that answer questions that sound simple but aren't:

• Is this vehicle currently reversing?
• Was this device installed properly?
• Which way is the device actually facing inside the vehicle?

The last one matters more than you might expect. Nobody installs these at a consistent angle, so the device doesn't know which direction is “forward” until it figures that out from the data — and the first two questions can't be answered until it does. Add in the fact that a truck might be sitting on a hill, and the sensor readings you'd expect to be obvious stop being obvious.

Geotab is providing physical devices and real production data, and an engineer from their automotive team will meet with the group weekly. You'll be working on a problem their engineers actually care about, with their input along the way.

Good fit if you're interested in sensor data, signal processing, or applied ML on messy real-world inputs.$description$,
      '',
      true,
      2026,
      array['James Cawse']::text[],
      null,
      null,
      true
    )
    returning id into seed_project_id;
  else
    update public.projects
       set tags = array['vehicle telematics', 'sensor data', 'signal processing', 'machine learning', 'applied AI']::text[],
           category = 'Consulting',
           "shortDescription" = 'Build machine learning models that answer practical questions about how vehicles and telematics devices are moving.',
           "impactDescription" = 'Use real vehicle sensor and engine data to infer reversing, installation quality, and device orientation in messy real-world conditions.',
           "fullDescription" = $description$Geotab builds the GO device: a small unit that plugs into a vehicle and streams data about how that vehicle is moving — GPS, motion sensors, and information straight from the engine. Millions of them are on the road.

This team will build machine learning models that answer questions that sound simple but aren't:

• Is this vehicle currently reversing?
• Was this device installed properly?
• Which way is the device actually facing inside the vehicle?

The last one matters more than you might expect. Nobody installs these at a consistent angle, so the device doesn't know which direction is “forward” until it figures that out from the data — and the first two questions can't be answered until it does. Add in the fact that a truck might be sitting on a hill, and the sensor readings you'd expect to be obvious stop being obvious.

Geotab is providing physical devices and real production data, and an engineer from their automotive team will meet with the group weekly. You'll be working on a problem their engineers actually care about, with their input along the way.

Good fit if you're interested in sensor data, signal processing, or applied ML on messy real-world inputs.$description$,
           published = true,
           year = 2026,
           "projectManagers" = array['James Cawse']::text[],
           is_hiring = true
     where id = seed_project_id;
  end if;

  insert into public.hiring_project_prompts (project_id, prompt_text, video_url)
  values (seed_project_id, 'What experience do you have in building projects and using AI?', null)
  on conflict (project_id) do update
    set prompt_text = excluded.prompt_text,
        video_url = excluded.video_url;
end
$$;
