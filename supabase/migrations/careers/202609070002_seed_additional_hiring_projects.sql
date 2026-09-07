-- Add the remaining 2026 research projects from the hiring brief.
-- Existing projects are matched by title and left unchanged. Prompt rows are
-- inserted only when they do not already exist.

do $$
declare
  project_data record;
  seed_project_id bigint;
begin
  for project_data in
    select *
    from (values
      (
        'Task-Differentiated EEG Hyperscanning'::text,
        array['EEG', 'hyperscanning', 'neuroscience', 'machine learning', 'teamwork']::text[],
        'Research'::text,
        'Investigate how distinct team roles influence neural synchronization during collaborative problem-solving.'::text,
        'The project combines experimental neuroscience and EEG machine learning to study neural coordination in realistic teamwork settings.'::text,
        $description$We are investigating EEG Hyperscanning: how two individuals'' brain waves synchronize during social interactions. Our framework aims to replicate realistic team settings by assigning participants distinct tasks but a shared goal—diffusing a virtual bomb. This procedure will inform our understanding of how neural synchronization potentially enables social teamwork.

In typical hyperscanning paradigms, we measure neural synchronization on participants who are completing identical tasks. This design has two main limitations we seek to address: (1) it applies poorly to most team settings, since team members tend to differ in tasks; (2) by giving identical tasks, participants are exposed to similar sensory stimuli. When studying the effects of cognitive teamwork on neural synchronization, shared sensory stimuli causes an issue where we cannot tell if the observed effects are due to cognition or sensation. By implementing distinct tasks, we increase our confidence that the observed synchronization is (1) reflective of real-world teamwork; (2) caused by cognitive synchronization.

We are aiming to make two sub-teams within our project, which each require different skill sets. The Research Team will complete literature reviews, write the paper, and run participants through the experimental procedure, and the Coding Team will pre-process and analyze EEG data using machine learning. Both teams will work together to create the experimental procedure to maximize ease of data collection and ability to fill gaps in the literature, as described above. For the Research Team, we want individuals who are adept at reading scientific literature, scientific writing and instructing participants through a procedure. For the Coding Team, we want individuals who have strong coding fundamentals—no previous AI or machine learning experience is needed. Experience with MATLAB, EEG, and EEGLAB is appreciated!$description$,
        array['Ashleigh Cunningham', 'Benjamin Craig-Browne']::text[],
        null::text,
        null::text,
        'https://drive.google.com/file/d/1lqYLEhB1AStXw91M53gwejinW-5Hxs4I/view?usp=sharing'::text
      ),
      (
        'Wildfire Discovery Drone'::text,
        array['computer vision', 'wildfire detection', 'drones', 'thermal imaging', 'sensor fusion']::text[],
        'Research'::text,
        'Develop a high-precision drone, sensor, and satellite-validation system for early wildfire detection.'::text,
        'The team will combine thermal imaging, gas sensing, onboard computing, MATLAB analysis, and satellite data to improve wildfire monitoring and prevention.'::text,
        $description$Under the supervision of Dr. Siddiqui and Dr. Asad, this project is developing a high-precision, drone-based wildfire detection and satellite validation system!

The team is operating RCMP commercial-grade drones, provided and piloted by professionals at the Royal Military College of Canada, equipped with a FLIR A700-series thermal camera (a $30,000+ research-grade radiometric imaging system) alongside CO, CO₂, and CH₄ gas sensors to capture fine-scale emission and heat signatures over high-risk areas such as farmland. The platform runs a distributed onboard computing architecture: an NVIDIA Jetson handles real-time thermal image acquisition and processing, while a Raspberry Pi 5 manages synchronized gas-sensor data collection, with all streams analyzed in MATLAB. By calibrating UAV measurements against ground-truth sensors and satellite data from sources like NASA, the project aims to validate and correct satellite wildfire detection with sub-pixel precision, transforming early detection into a powerful tool for prevention.$description$,
        array['Viona Hashemkhani']::text[],
        'Dr. Siddiqui and Dr. Asad'::text,
        null::text,
        null::text
      ),
      (
        'Diffusion-Model Rendering for Re-Themable Games'::text,
        array['diffusion models', 'computer vision', 'game development', 'real-time rendering', 'generative AI']::text[],
        'Research'::text,
        'Explore whether diffusion models can render live game worlds that change theme from a prompt while players continue playing.'::text,
        'The project investigates real-time generative rendering conditioned on game state, prompts, and reference images instead of fixed art assets.'::text,
        $description$Supervisor/Client: Robert Ciborowsko - Chatforce
Budget: $10,000 ($5,000 direct + $5,000 AWS)

Imagine a Doom-style shooter running live. WASD to move, one button to shoot. Now you type "make this Care Bears" and the walls, the enemies, the entire look of the game change on the spot. No re-downloading assets. No artist rebuilding anything. No coding agent regenerating textures in the background. The game just becomes the new theme while you keep playing.

That is impossible in a traditional engine, because the visuals are baked into hand-built 3D models and textures. Changing the look means rebuilding the assets. A diffusion model sidesteps this entirely. Instead of drawing triangles, it generates each frame directly—the way an image model synthesizes a picture from noise—except conditioned on the game''s state and run in a loop, each frame feeding the next. If the look is driven by a prompt or a reference image instead of fixed assets, re-theming stops being an asset pipeline problem and becomes a conditioning problem.

That''s the north star. This year, we''re going to explore that problem space to see if it''s one day feasible.

Further Project Details: https://drive.google.com/file/d/1tptag4-g5bOo2qjKrx6eM_tjnsjF2ngQ/view?usp=sharing$description$,
        array['Matthew Lones']::text[],
        null::text,
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
      faculty_advisor_url,
      video_url
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
    end if;

    insert into public.hiring_project_prompts (project_id, prompt_text, video_url)
    values (
      seed_project_id,
      case project_data.project_title
        when 'Task-Differentiated EEG Hyperscanning' then null
        when 'Wildfire Discovery Drone' then
          $prompt$Tell me an interesting story about yourself.$prompt$
        when 'Diffusion-Model Rendering for Re-Themable Games' then
          $prompt$Tell me what your passion for AI comes from. What are your goals and why do you pursue them?$prompt$
      end,
      project_data.video_url
    )
    on conflict (project_id) do nothing;
  end loop;
end
$$;
