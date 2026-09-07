-- Seed the 2026 Consulting and Research projects from the hiring brief.
--
-- This migration is safe to re-run. Existing projects are matched by their
-- title so their ids, images, PM login emails, and GitHub links are retained.
-- The prompt table is keyed by project_id and is upserted below.

alter table public.projects
  add column if not exists "projectManagers" text[] not null default '{}'::text[],
  add column if not exists "facultyAdvisor" text,
  add column if not exists "facultyAdvisorUrl" text;

do $$
declare
  project_data record;
  seed_project_id bigint;
begin
  for project_data in
    select *
    from (values
      (
        'DCP Federated Learning'::text,
        array['federated learning', 'machine learning', 'JavaScript', 'TypeScript', 'healthcare']::text[],
        'Consulting'::text,
        'Build a proof-of-concept federated learning package on DCP so hospitals can train a shared machine-learning model without sharing private data.'::text,
        'The initial application is predicting treatment response to biologics for psoriatic arthritis. The package will be publicly released as open source, and the project offers hands-on experience researching ML models and implementing federated learning techniques.'::text,
        $description$In partnership with Distributive, a Kingston-based distributed computing development company, we are building a proof-of-concept package that lets people run federated learning on top of DCP (Distributive's compute-sharing platform). This package will enable multiple hospitals to train one shared Machine Learning model together, without ever having to share their private data with each other, or with us. Initial application focus is predicting treatment response to biologics for psoriatic arthritis. This project will give you hands-on experience researching ML models and implementing federated learning techniques. The package we produce will be made publicly available once it's completed, contributing to the open-source ML ecosystem. We'll likely be building this in JavaScript/TypeScript, so experience with either will come in handy!$description$,
        array['Nate Cheung', 'Theo Leone']::text[],
        null::text,
        null::text,
        null::text
      ),
      (
        'Conversational Intelligence for Advanced Process Control'::text,
        array['conversational AI', 'natural language', 'process control', 'mining', 'explainability']::text[],
        'Consulting'::text,
        'Explore a conversational AI framework that explains complex Advanced Process Control behaviour to engineers and operators in mineral processing.'::text,
        'The framework will combine process data, controller information, and operational knowledge to produce clear, evidence-based explanations that support better operational decisions.'::text,
        $description$Built in collaboration with Woodgrove Technologies, a mining and mineral processing company based in Toronto, this project explores a conversational AI framework for Advanced Process Control systems used in mineral processing. The framework will bring together process data, controller information, and operational knowledge to help explain complex plant behaviour and controller actions.

These systems automate complex decisions across processes such as grinding, flotation, and separation, but often provide limited visibility into why certain actions are taken. The goal is to use AI to turn this complex and fragmented information into clear, evidence-based natural language explanations, helping engineers and operators better understand system behaviour and make more informed decisions.$description$,
        array['Ryanjeet Gill', 'Evan Johnstone']::text[],
        null::text,
        null::text,
        'https://drive.google.com/file/d/1w2u7Qo4D8XUKe9Jr2GRI3VGITfo8BY5m/view?usp=sharing'::text
      ),
      (
        'TrustLayer'::text,
        array['responsible AI', 'evaluation', 'LLMs', 'AI agents', 'safety']::text[],
        'Consulting'::text,
        'Develop a responsible AI evaluation system that assesses AI-generated outputs and actions before they enter real-world workflows.'::text,
        'The team will evaluate reliability, fairness, safety, and the need for human review while working with industry partners to shape the system around a real responsible-AI challenge.'::text,
        $description$This project will develop a responsible AI evaluation system designed to assess AI-generated outputs or actions before they are used in real-world workflows. As organizations increasingly rely on LLMs and AI agents, unreliable, biased, unsafe, or unsupported outputs can become difficult to catch before they affect users or downstream decisions. The project's initial direction is to build a flexible evaluation and quality-assurance layer that can assess factors such as factual reliability, fairness, safety, and whether human review is required. The team will also work with industry partners early in the project to identify a real responsible AI challenge and refine the final system around the needs of the selected client.$description$,
        array['Reyan Seghal']::text[],
        null::text,
        null::text,
        null::text
      ),
      (
        'AI Agent Integration'::text,
        array['AI agents', 'governance', 'business strategy', 'traceability', 'security']::text[],
        'Consulting'::text,
        'Build a governed AI platform that enables intelligent agents to support complex business work and informed decision-making.'::text,
        'Working with Electric Mind, the team will create a reliable, traceable, and secure foundation for agents that analyze business problems and coordinate information across an organization.'::text,
        $description$Due to the confidential nature of the client, this description is abridged.

Working with Electric Mind, a consulting firm in downtown Toronto, to develop a governed AI platform that enables intelligent agents to support complex business work. The project focuses on building a reliable and scalable foundation for AI, with agents designed to analyze complex business problems, coordinate information across different areas of an organization, and support informed decision-making and strategic recommendations. The team will focus on building a reliable and scalable foundation for AI, working with the Electric Mind team to integrate AI tools in high impact fields, ensuring accuracy, traceability, and security.$description$,
        array['Elizabeth Bighiu', 'Eitan Zur']::text[],
        null::text,
        null::text,
        null::text
      ),
      (
        'ScamBench AI Recruitment Phishing'::text,
        array['cybersecurity', 'phishing', 'deepfakes', 'human behaviour', 'experiments']::text[],
        'Research'::text,
        'Study how AI-generated recruiter profiles and deepfakes influence trust and security decisions during multi-step remote job scams.'::text,
        'In collaboration with Menlo Park Intelligence, the project will use a two-stage recruitment experiment to measure compliance, hesitation, and the effects of visual fidelity on later scrutiny.'::text,
        $description$Generative AI has fueled a massive spike in remote job scams, yet current security tools fail to address how human judgment breaks down during multi-step deceptions. It remains unclear if early trust in a synthetic recruiter profile causes victims to drop their guard, or if a deepfake's visual quality matters more than the mere presence of professional branding. In collaboration with Menlo Park Intelligence, a research organization led by Fred Heiding, Research Fellow at UC Berkeley, this project uses a remote, two-stage recruitment experiment with varying AI visual fidelity. By tracking compliance and hidden metrics like hesitation, we will isolate whether early trust reduces later scrutiny, providing the foundational data needed to design better cybersecurity defenses.$description$,
        array['Michelle Kelly', 'Basma Azeem']::text[],
        null::text,
        null::text,
        null::text
      ),
      (
        'Beyond AUROC: Clinical Readiness of ED Chest-Pain AI'::text,
        array['healthcare', 'clinical AI', 'emergency medicine', 'machine learning', 'evidence review']::text[],
        'Research'::text,
        'Evaluate what evidence is needed before chest-pain AI models can be trusted in real emergency-department decisions.'::text,
        'Beyond AUROC will assess calibration, safety of decision thresholds, generalizability, and workflow fit before shaping a feasible MIMIC-IV benchmark, subject to access and linkage feasibility.'::text,
        $description$Can an AI model look excellent on paper and still be unready for the bedside? This project asks what evidence is needed before a chest-pain model can be trusted in real emergency-department decisions.

Emergency clinicians must identify acute coronary syndrome quickly while avoiding unnecessary admission, prolonged observation, and testing for lower-risk patients. AI and machine-learning models may help, but a high area under the receiver operating characteristic curve (AUROC) only shows discrimination. It does not establish that predicted risks are accurate, thresholds are safe, results generalize, or the model fits the clinical workflow.

Beyond AUROC will update the evidence on AI/ML models used for diagnosis, short-term coronary prognosis, and coronary-risk-informed disposition in adults presenting to the ED with chest pain or suspected ACS. The review will evaluate clinical readiness using current prediction-model guidance. Its findings will then shape a feasible, workflow-constrained benchmark using MIMIC-IV data, subject to access and linkage feasibility.$description$,
        array['Bramleen Papneja']::text[],
        'Dr. Venkatesh Thiruganasambandamoorthy'::text,
        'https://ohri.ca/en/find-researcher/venkatesh-thiruganasambandamoorthy'::text,
        null::text
      ),
      (
        'LLM-Enhanced Decision Making Agents for Cloud Autoscaling'::text,
        array['LLMs', 'cloud computing', 'autoscaling', 'systems', 'decision-making']::text[],
        'Research'::text,
        'Explore whether large language models can improve dynamic cloud resource management through context-aware autoscaling decisions.'::text,
        'The research will evaluate when LLM-based reasoning adds value against traditional threshold and control-policy methods, including trade-offs in performance, resource efficiency, and adaptability.'::text,
        $description$This project explores the use of large language models as intelligent decision-making agents for dynamic cloud resource management. We will develop an LLM-enhanced autoscaling controller that interprets real-time system telemetry such as CPU utilization, request traffic, response latency, and resource availability to determine when and how cloud resources should be scaled.

By integrating contextual information and operational objectives alongside traditional system metrics, the controller aims to make more informed and adaptable scaling decisions. Traditional cloud autoscaling methods typically rely on predefined thresholds or control policies that react to changes in system utilization. While effective, these approaches have limited ability to incorporate higher-level context or adapt their decision-making strategy to unfamiliar conditions. Our research will examine under what conditions LLM-based reasoning provides meaningful value, while evaluating trade-offs in system performance, resource efficiency and adaptability.$description$,
        array['Daryan Fadavi']::text[],
        null::text,
        null::text,
        null::text
      ),
      (
        'Uncertainty-Aware Deep Learning for Parkinsonian Motor Symptom Severity Estimation from Monocular Video'::text,
        array['computer vision', 'deep learning', 'healthcare', 'uncertainty', 'fairness']::text[],
        'Research'::text,
        'Use monocular video and uncertainty-aware deep learning to estimate Parkinsonian motor symptom severity while communicating when the model is unsure.'::text,
        'The project combines pose estimation, temporal modelling, explainability, fairness, and human oversight to explore more transparent and responsible clinical decision support.'::text,
        $description$Rather than producing a binary prediction of whether a patient has Parkinson's disease, this project explores computer vision for uncertainty-aware assessment of Parkinson's motor symptoms from monocular video. Using pose estimation and temporal deep learning, the model would quantify movement patterns and estimate motor symptom severity while communicating how uncertain it is in its predictions, such as through confidence or prediction intervals. The project will also examine the ethical implications of using AI for neurological assessment, including whether model performance and uncertainty differ across patient populations, how potential biases in training data may affect predictions, and when an AI system should defer to clinician judgement rather than provide an assessment. By integrating uncertainty, explainability, fairness, and human oversight into model evaluation, the project aims to explore how computer vision systems can provide more transparent, reliable, and ethically responsible support for clinical decision-making.$description$,
        array['Wendy Zhang', 'Jason Chen']::text[],
        null::text,
        null::text,
        null::text
      ),
      (
        'CanopyMap'::text,
        array['agricultural technology', 'computer vision', 'image segmentation', 'indoor farming', 'automation']::text[],
        'Research'::text,
        'Use computer vision to measure plant growth in indoor farms and help automate growth-optimization decisions.'::text,
        'CanopyMap addresses the lack of high-quality training data for indoor agriculture by applying existing segmentation models to camera data from an aeroponic farm.'::text,
        $description$Two of the biggest pain points for agricultural tech and a barrier to automation is measuring plant growth and obtaining quality training data at a large scale. Farming environments can vary a lot and the hardware that is used to monitor such environments can often be in very different conditions which makes adapting a single model to different environments very challenging.

Lots of research papers cover outdoor farming, very few try to fix the gap in training data for indoor environments. That's what we're trying to fix with CanopyMap. We have access to an aeroponic farm with lots of cameras. We are going to use existing models to run image segmentation on the plants and using that try to measure the plant growth over time. This will eventually help the farm automate its growth optimization algorithm.$description$,
        array[]::text[],
        'Dr. Christian Muse'::text,
        null::text,
        null::text
      ),
      (
        'Mechanistic Interpretability of Test-Time Reasoning in Large Language Models'::text,
        array['mechanistic interpretability', 'LLMs', 'AI safety', 'sparse autoencoders', 'open source']::text[],
        'Research'::text,
        'Build an interpretability toolkit to investigate the internal circuits behind uncertainty, branching, premise commitment, and error recovery in reasoning models.'::text,
        'The team will use sparse autoencoders and causal interventions on models such as Qwen-2.5-Math and DeepSeek-R1-Distill to develop open-source tools and a diagnostic benchmark for AI safety research.'::text,
        $description$Ever wondered what's actually happening inside a reasoning model when it "thinks"?

Modern reasoning models like GPT-5, Gemini 3, and Deepseek-R1 don't just spit out an answer, they burn extra compute at inference time, generating long chains of intermediate steps before committing to a final response. This "test-time reasoning" is why they're so good at math, logic, and multi-step problems. But we only ever watch this process from the outside, reading the output tokens as a model branches, backtracks, or corrects itself. Nobody actually knows what's happening under the hood when it does.

Worse, these models' most dangerous failures aren't hesitant guesses; they're confident, fluent, perfectly-structured chains of reasoning that are just wrong. And the tools we use to catch uncertainty during test-time reasoning, like token entropy, are blind to this exact failure mode, because a confidently wrong model doesn't look uncertain at all.

We're building the first mechanistic interpretability toolkit for test-time reasoning itself. Using sparse autoencoders, the same technique Anthropic used to find interpretable features inside Claude, we're going to crack open models like Qwen-2.5-Math and DeepSeek-R1-Distill while they reason, and find the actual internal circuits behind uncertainty, branching, premise commitment, and error recovery as they unfold step by step. Then we're not just going to observe these features, we're going to causally test them: amplify them, suppress them, and see if we can steer a model toward catching its own mistakes mid-chain, before they cascade into a wrong answer.

This is a research team building real infrastructure (SAELens, TransformerLens, Circuit Tracer), targeting a workshop paper and a top-venue submission. You'll get hands-on experience in one of the most in-demand, least-taught areas of AI safety research, the kind of work that's usually locked inside frontier labs, while actually shipping open-source tools and a diagnostic benchmark the community can use.

If you want to stop treating language models as black boxes and start finding out what's really going on inside them while they think, this is the project.$description$,
        array['Kevin Wang', 'Rastin Aghighi']::text[],
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
    values (
      seed_project_id,
      case project_data.project_title
        when 'DCP Federated Learning' then
          $prompt$Describe a project you recently worked on that you feel passionate about.$prompt$
        when 'Conversational Intelligence for Advanced Process Control' then
          $prompt$Tell us what motivates you, and how that motivation has pushed you to create opportunities for yourself and pursue new challenges or learning experiences.$prompt$
        when 'TrustLayer' then
          $prompt$Tell us about a time you had to solve a problem where the answer or path forward was not immediately clear. How did you approach it, what factors did you consider, and how did you decide what to do?$prompt$
        when 'AI Agent Integration' then
          $prompt$Share a project you have worked on that you are most proud of. Explain the goal of your project and your role within it.$prompt$
        when 'ScamBench AI Recruitment Phishing' then
          $prompt$Pick one:

Walk us through a time you had to adjust a project plan midway through because something wasn't working.

How do you decide whether a source is trustworthy when you're researching something outside your expertise?$prompt$
        when 'Beyond AUROC: Clinical Readiness of ED Chest-Pain AI' then
          $prompt$AI models can perform well on paper but still be difficult to trust in real clinical settings. What do you think is the biggest challenge in closing that gap? Explain how you would approach it and what skills or experiences you would bring to the team.$prompt$
        when 'LLM-Enhanced Decision Making Agents for Cloud Autoscaling' then
          $prompt$What is something you have gone down a rabbit hole learning about recently?$prompt$
        when 'Uncertainty-Aware Deep Learning for Parkinsonian Motor Symptom Severity Estimation from Monocular Video' then
          $prompt$When developing an AI system for a real-world application, what factors should a team consider beyond achieving high model accuracy? Choose one or two factors you think are most important and explain why.$prompt$
        when 'CanopyMap' then
          $prompt$Teach me about a concept/skill that you are very passionate about in a minute or two. Could be anything, as long as you can make me feel like I know a lot about it at the end without actually overloading me with information.$prompt$
        when 'Mechanistic Interpretability of Test-Time Reasoning in Large Language Models' then
          $prompt$Briefly describe your career interests or study plans. How does QMIND contribute to them?$prompt$
      end,
      project_data.video_url
    )
    on conflict (project_id) do update
      set prompt_text = excluded.prompt_text,
          video_url = excluded.video_url;
  end loop;
end
$$;

comment on column public.projects."projectManagers" is
  'Names of project managers listed in the hiring brief; separate from pmEmail, which identifies the authenticated project owner.';
comment on column public.projects."facultyAdvisor" is
  'Optional faculty advisor listed in the hiring brief.';
comment on column public.projects."facultyAdvisorUrl" is
  'Optional public faculty advisor profile URL from the hiring brief.';
