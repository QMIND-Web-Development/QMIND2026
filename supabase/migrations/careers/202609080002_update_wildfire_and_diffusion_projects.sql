-- Update the Wildfire Discovery Drone and diffusion-rendering projects with
-- the latest hiring brief. Existing ids, images, links, and project ownership
-- data are preserved. Re-running this migration is safe.

do $$
declare
  project_data record;
  seed_project_id bigint;
begin
  for project_data in
    select *
    from (values
      (
        'Wildfire Discovery Drone'::text,
        array['computer vision', 'wildfire detection', 'drones', 'thermal imaging', 'sensor fusion']::text[],
        'Research'::text,
        'Develop a high-precision drone, sensor, and satellite-validation system for early wildfire detection.'::text,
        'The team will combine thermal imaging, gas sensing, onboard computing, MATLAB analysis, and satellite data to improve wildfire monitoring and prevention.'::text,
        $wildfire$Under the supervision of Dr. Siddiqui and Dr. Asad, this project is developing a high-precision, drone-based wildfire detection and satellite validation system!

The team is operating RCMP commercial-grade drones, provided and piloted by professionals at the Royal Military College of Canada, equipped with a FLIR A700-series thermal camera (a $30,000+ research-grade radiometric imaging system) alongside CO, CO₂, and CH₄ gas sensors to capture fine-scale emission and heat signatures over high-risk areas such as farmland. The platform runs a distributed onboard computing architecture: an NVIDIA Jetson handles real-time thermal image acquisition and processing, while a Raspberry Pi 5 manages synchronized gas-sensor data collection, with all streams analyzed in MATLAB. By calibrating UAV measurements against ground-truth sensors and satellite data from sources like NASA, the project aims to validate and correct satellite wildfire detection with sub-pixel precision, transforming early detection into a powerful tool for prevention.$wildfire$,
        array['Viona Hashemkhani']::text[],
        'Dr. Siddiqui and Dr. Asad'::text,
        null::text,
        $prompt$Tell me an interesting story about yourself.$prompt$
      ),
      (
        'Diffusion-Model Rendering for Re-Themable Games'::text,
        array['diffusion models', 'computer vision', 'game development', 'real-time rendering', 'generative AI']::text[],
        'Research'::text,
        'Investigate whether a small diffusion renderer can compose unseen visual attribute combinations in interactive game scenes.'::text,
        'The project will test how dataset design, model capacity, and architecture affect controllable generative game rendering under realistic research constraints.'::text,
        $diffusion$Recent work has demonstrated that diffusion models can serve as interactive game renderers, generating each frame conditioned on game state rather than rasterizing hand-built assets. Existing systems, however, either render a single fixed visual style or achieve open-ended visual control only through datasets of a scale far beyond the reach of most research budgets. This project investigates the intermediate question: whether a small diffusion renderer, trained on a densely factored dataset, can compose visual attributes it has seen into combinations it has not. To make that question tractable, the team will construct a custom Doom-style ray-cast engine and a deterministic skinning pipeline, giving full control over the structure of the training data and the design of held-out combinations. Success would provide early evidence that the approach scales; failure would distinguish capacity-bound from architecture-bound limitations, which is itself a useful and reportable result.

Members will work across four streams — engine and rendering, data pipeline design, diffusion model architecture and training, and evaluation and representational analysis — with deliverables including the engine, the data generation pipeline, a trained conditional renderer, and a full account of the findings. The project is supported by $10,000 in funding from Chatforce and is supervised by Robert Ciborowsko.

Further Project Details: https://drive.google.com/file/d/1tptag4-g5bOo2qjKrx6eM_tjnsjF2ngQ/view?usp=sharing$diffusion$,
        array['Matthew Lones']::text[],
        'Robert Ciborowsko'::text,
        null::text,
        $prompt$Tell me what your passion for AI comes from. What are your goals and why do you pursue them?$prompt$
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
      faculty_advisor_url,
      prompt_text
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
         set tags = project_data.project_tags,
             category = project_data.project_category,
             "shortDescription" = project_data.short_description,
             "impactDescription" = project_data.impact_description,
             "fullDescription" = project_data.full_description,
             published = true,
             year = 2026,
             is_hiring = true,
             "projectManagers" = project_data.project_managers,
             "facultyAdvisor" = project_data.faculty_advisor
       where id = seed_project_id;
    end if;

    insert into public.hiring_project_prompts (project_id, prompt_text, video_url)
    values (seed_project_id, project_data.prompt_text, null)
    on conflict (project_id) do update
      set prompt_text = excluded.prompt_text,
          video_url = excluded.video_url;
  end loop;
end
$$;
