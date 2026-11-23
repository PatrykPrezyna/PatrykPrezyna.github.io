/*
  ┌──────────────────────────────────────────────────────────────────┐
  │  CONTENT OF THE WEBSITE — this is the only file you need to edit │
  └──────────────────────────────────────────────────────────────────┘

  Sections in this file (search for the number, e.g. "5. PORTFOLIO"):

    1. PERSON AND CONTACT      name, e-mail, LinkedIn, photo
    2. HERO                    the top of the page
    3. STATS                   the four items in the dark bar
    4. ABOUT                   the "About" paragraphs
    5. SKILLS                  the "Technical skills" badges
    6. PORTFOLIO               the projects
    7. PUBLICATIONS            patents and papers
    8. CONTACT                 the closing section

  Rules of the file:
    - Text goes between "double quotes".
    - Every line of a list ends with a comma.
    - To use a " inside a text, write \" instead.
    - Lines that start with // are notes. The website ignores them.
    - Pictures go in the "assets" folder. Write their path as "assets/folder/file.png".

  If the page shows a red error box after an edit, a comma or a quote
  is missing near the line it names. README.md has step-by-step examples.
*/

window.SITE = {

  // ====================================================================
  // 1. PERSON AND CONTACT
  // ====================================================================
  person: {
    firstName: "Patryk",
    lastName: "Prężyna",
    email: "Patryk78@mit.edu",
    linkedin: "https://www.linkedin.com/in/patryk-prezyna",
    photo: "assets/patryk.jpg",

    // The "Download CV" buttons open this note instead of a file.
    // "Send me an email" opens the visitor's own mail app, already addressed
    // to the e-mail above. GitHub Pages cannot send the message itself.
    cv: {
      title: "I would love to get to know you",
      text: "Let's schedule a call or grab a coffee.",
      button: "Send me an email",
      subject: "Let's schedule a call or grab a coffee",
      body: "Hi Patryk,\n\nI would like to schedule a call or grab a coffee.\n\n",
    },
  },

  // ====================================================================
  // 2. HERO
  // The top of the page, next to the photo.
  // ====================================================================
  hero: {
    eyebrow: "Software · Regulated Manufacturing · Systems Engineering",
    tagline: "Ten years delivering automation, robotics, and software in regulated pharmaceutical manufacturing — now at MIT, connecting software with hardware and leadership.",
  },

  // ====================================================================
  // 3. STATS
  // The dark bar under the photo. Four items look best.
  // An item is either a big number with a label, or an icon with short lines.
  // ====================================================================
  stats: [
    { number: "10+", label: "Years in Regulated Industries" },
    { number: "3", label: "Patents" },
    { number: "MIT", label: "M.S. Engineering and Management" },
    {
      icon: "assets/languages.png",
      lines: [
        "Business and engineering",
        "Software and hardware",
        "English, German, and Polish",
      ],
    },
  ],

  // ====================================================================
  // 4. ABOUT
  // One line per paragraph.
  // ====================================================================
  about: [
    "I am a systems engineer and researcher at MIT. During my master’s in System Design and Management, I taught Model-Based Engineering in the Product Development Lifecycle, a class I developed with Eric Rebentisch. My research is how small and medium-sized organizations adopt model-based systems engineering (MBSE). I am developing the methodology and tools by simplifying the SysML v2 language and incorporating AI assistants.",
    "Before MIT I was a senior engineer at Rommelag, a leader in blow-fill-seal systems for aseptic pharmaceutical packaging, across automation, software, and human-machine interfaces. I am taking that practice into medical devices. The current project is localized spinal cord hypothermia, kept inside design controls. The direction from here is the digital thread for agile teams in regulated industries.",
    "I have led teams across software and hardware in English, German, and Polish. Translating between business and engineering. My current focus is on Model Based Systems Engineering and Digital Thread for agile teams in regulated industries.",
  ],

  // ====================================================================
  // 5. SKILLS
  // The "Technical skills" badges.
  //
  // ADD A SKILL: add a line with the name, for example   "Robotics",
  //
  // LINKS: a skill becomes a link when a project in section 6 has a badge
  // with exactly the same name. It then opens that project. Nothing to set.
  // If the names differ, name the project yourself with its id:
  //   { name: "Agile / Scrum", project: "machine" },
  // A skill with no matching project is shown as a plain badge.
  // ====================================================================
  skills: [
    "Engineering Management",
    { name: "Software (Python, Vue.js)", project: "hmi" },
    { name: "Agile / Scrum", project: "machine" },
    "Firmware (C, LabVIEW)",
    "AI and ML for Engineering Design",
    "DevOps",
    "Digital Thread",
    "PLC · B&R, S7, CodeSys",
    "Fast Prototyping",
    "ECAD (KiCad)",
    "Robotics",
    "CAD (Fusion, Python CAD)",
    "MBSE (CAMEO, SysMLv2)",
    "PLM (Windchill, 3DExperience)",
    "ISO 13485",
    "ISO 14971",
    "Docker",
    "Domain-driven design",
    "Leadership",
    "IP",
    "GAMP",
  ],

  // ====================================================================
  // 6. PORTFOLIO
  // One block { ... } per project, shown in the order written here.
  // Projects with "featured: false" are shown as small tiles under the others.
  // Numbers (01, 02, ...) are set automatically.
  //
  // ADD A PROJECT: copy the template below, paste it where the project
  // should appear, remove the // at the start of each line, and fill it in.
  // REMOVE A PROJECT: delete its block, from its "{" to its "},".
  // HIDE A PROJECT without deleting it: add the line   draft: true,
  //
  // {
  //   id: "my-project",            // short name, no spaces. Used for links from skills.
  //   tag: "Robotics",             // small label before the title
  //   title: "Name of the project",
  //   featured: true,              // true = full-width row. false = small tile in the grid below.
  //   images: [                    // first picture is shown first. Leave out "images" if there are none.
  //     {
  //       file: "assets/my-project/picture.png",
  //       caption: "Short text shown under the picture.",
  //       description: "What the picture shows, for screen readers.",
  //       // fill: true,           // add for photos that should fill the frame and may be cropped
  //     },
  //   ],
  //   facts: [                     // optional big numbers
  //     { number: "15,000", label: "What the number means" },
  //   ],
  //   challenge: "One paragraph.",       // or a list:  ["Point one.", "Point two."],
  //   contribution: [
  //     "What I did, one line per point.",
  //   ],
  //   badges: ["ISO 13485", "Python"],   // skills shown under the project
  // },
  // ====================================================================
  projects: [
    {
      id: "medical-device",
      tag: "Medical Device",
      title: "Medical device",
      featured: true,
      open: true,              // this project is open when the page loads
      images: [
        {
          file: "assets/coolspine/spinal-hypothermia.png",
          caption: "Medical Device providing spinal cord hypothermia.",
          description: "Cooling console on a rolling stand, with lines from the IN, OUT, and CSF ports to the lower spinal cord. A close view of the spine labels the spinal cord and the thoracic aorta.",
        },
        {
          file: "assets/coolspine/p15-sense.png",
          caption: "Custom PCB with temperature, flowrate, and pressure sensing.",
          description: "P1.5 SENSE circuit board with connectors for a temperature sensor, pressure sensor, thermistor, and backup ADC input.",
        },
        {
          file: "assets/coolspine/runtime-architecture.png",
          caption: "Runtime architecture. Readings in from the sensors, commands out to the pump and the compressor.",
          description: "Diagram of the spine cooling runtime. Temperature, flow, differential pressure, and digital interlocks feed a control core with a main thread, an I/O thread, and a stepper thread. The control core commands a peristaltic pump and a cooling compressor. Operating states are Init, Ready, Cooling, and Pumping, with Error and Shutdown beside them.",
        },
        {
          file: "assets/coolspine/traceability.png",
          caption: "Traceability between user needs, design inputs and outputs according to ISO 13485.",
          description: "Requirements diagram tracing user needs for spinal cord cooling to system requirements and to the refrigeration unit, touch display, and fluid reservoir.",
        },
        {
          file: "assets/coolspine/prototype.jpg",
          caption: "Fast prototyping.",
          description: "MIT Cool Spine Version 1.5 prototype on a bench. The front panel has a touchscreen, catheter ports, and a label that reads Research Use Only, Not for Use on Humans.",
        },
        {
          file: "assets/coolspine/ui.png",
          caption: "Intuitive and simplistic user interface.",
          description: "Temperature screen for the cooling device, with a trend chart, an error that the heat exchanger is too cold, and readings for the tip, cartridge, catheter, cool plate, and compressor.",
        },
      ],
      facts: [
        { number: "15,000", label: "Deaths per year from thoracic aortic aneurysm rupture in the US" },
        { number: "6–18%", label: "Risk of post-op paraplegia from spinal cord ischemia during repair" },
      ],
      contribution: [
        "Developed the software while coordinating the mechanical, electrical, and regulatory work.",
        "Led systems engineering in a fast-moving team while keeping the work compliant.",
        "Designed preclinical study protocols and built multiphysics models to predict therapeutic efficacy.",
      ],
      badges: ["ISO 13485", "ISO 14971", "Fast Prototyping"],
    },
    {
      id: "hmi",
      tag: "Interfaces",
      title: "Human-Machine Interface and IoT interfaces",
      featured: true,
      images: [
        {
          file: "assets/bp700/hmi-data-diode.jpg",
          caption: "Human Machine Interface modalities",
          description: "Two operators in cleanroom clothing at Rommelag machines. One wears a headset and gestures at a display of real-time monitoring. The other uses the touchscreen. A data diode carries the data to a remote desk with a machine overview and a live camera feed.",
          fill: true,
        },
        {
          file: "assets/bp700/bp730-hmi.jpg",
          caption: "Modern infrastructure with modern look.",
          description: "Operator screen showing a sterilization step in progress, with temperature probes and a stabilizing timer",
        },
        {
          file: "assets/bp700/hmi-ecosystem.png",
          caption: "Connecting Stakeholders and devices.",
          description: "Diagram of the operator, plan manager, and hotline around the human-machine interface, Rommelag Pharma Platform, programmable logic controller, servo control, and manufacturing execution system.",
        },
      ],
      challenge: [
        "Reduce operator onboarding time from months to days.",
        "Enable connectivity while guaranteeing security in critical industries.",
      ],
      contribution: [
        "Defined the system architecture, product strategy, and roadmap for the next-generation human-machine interface.",
        "Built a full-stack application, from the firmware to the cloud.",
        "With executive leadership, moved the company from delivering projects to running a product.",
      ],
      badges: ["Python", "Vue.js", "Docker", "Domain-driven design"],
    },
    {
      id: "machine",
      tag: "Systems",
      title: "New machine generation",
      featured: true,
      images: [
        {
          file: "assets/bp700/bp730-side.jpg",
          caption: "BP 730, the new machine generation.",
          description: "bottelpack bp 730 beside the classified-area wall, with most of the machine outside that room",
          fill: true,
        },
        {
          file: "assets/bp700/line-systems.jpg",
          caption: "The line as three systems: pneumatic, electrical, and motion.",
          description: "Diagram of a packaging line labeled with air and liquid filters, temperature sensors, visual inspection, a PLC, an HMI, a robot, and the motor, belt, and linear rail. A legend groups the parts into pneumatic, electrical, and motion.",
        },
        {
          file: "assets/bp700/sterile-robots.jpg",
          caption: "Concepts for robotics in a sterile environment.",
          description: "Two Stäubli robots handling containers on a stainless steel surface inside a sterile enclosure.",
        },
        // Hidden. Uncomment this block to show it again.
        // {
        //   file: "assets/bp700/state-transformation.png",
        //   caption: "A process as states and transformations: coffee beans are ground into powder, then brewed into coffee in a mug. Below, the same pattern in general: state, transformation, state.",
        //   description: "Diagram of coffee beans ground into powder and brewed into coffee, and the general pattern of state, transformation, state.",
        // },
        {
          file: "assets/bp700/process-model.png",
          caption: "Process model of the machine line, from material preparation through forming, filling, and sealing.",
          description: "Wide process diagram of the manufacturing line, with material flows through preparation, forming, filling, and sealing.",
        },
        {
          file: "assets/bp700/se-value-stream.png",
          caption: "Organisational Transformation",
          description: "Diagram comparing systems engineering as its own discipline with systems engineering inside each value stream team, across software, mechanical, and electrical.",
        },
      ],
      challenge: [
        "Improve output and performance.",
        "Reduce development time and cost.",
        "Transform the organization from project-driven to product-driven.",
      ],
      contribution: [
        "Systems engineering on this line was that span: from the automation through the packaging equipment, the devices that produce the container, and the molding tools that travel with each format.",
        "Cleaning, recipes, and the guided operator interface are part of the same system, on GAMP category 4 software.",
      ],
      badges: ["Leadership", "Agile for Hardware", "IP", "GAMP"],
    },
    {
      id: "software",
      tag: "Software",
      title: "Industrial automation software stack",
      featured: true,
      images: [
        {
          file: "assets/bp700/ladder-to-model.png",
          caption: "From archaic language to model-based software development.",
          description: "Conveyor ladder logic beside a model of the same control, with states above and a generated structure below.",
        },
        {
          file: "assets/bp700/gitflow.png",
          caption: "Introducing semantic versioning and a modern workflow.",
          description: "Zip archives named FINAL and latest beside a Gitflow diagram with main, release, develop, feature, and hot-fix branches.",
        },
      ],
      challenge: "The operator walks a batch through sterilization and the other critical steps. The process parameters have to stay on the same screen, and the software and the machine have to describe one process.",
      contribution: [
        "On the Blow-Fill-Seal line I upgraded the software the operator runs. The part shown here is the human-machine interface, built in Python, Vue.js, and Docker.",
        "It walks a batch through sterilization and the other critical steps, and it keeps the process parameters on the same screen.",
        "The screen sits on a domain model shared with the mechatronic team, so the software and the machine describe one process.",
      ],
      badges: ["Python", "Vue.js", "Docker", "Domain-driven design"],
    },
    {
      id: "teaching",
      tag: "Teaching",
      title: "Teaching the digital thread",
      featured: false,
      challenge: "Model-Based Engineering in the Product Development Lifecycle, including the digital thread.",
      contribution: [
        "I teach that class at MIT. The write-up of that teaching is not on the page yet.",
      ],
    },
    {
      id: "thesis",
      tag: "Thesis",
      title: "MBSE for small organizations and agile teams",
      featured: false,
      images: [
        {
          file: "assets/thesis/method-language-tool.png",
          caption: "Method, language, and tool, with AI assistance in the middle.",
          description: "Triangle of method, language, and tool around AI assistance, inside a loop labeled Continues Integration and Human in the Loop.",
        },
        {
          file: "assets/thesis/TaskMap_ConceptSelection_Example.png",
          caption: "Concept selection by a Pugh matrix or a trade-space exploration.",
          description: "Task map of concept selection. Candidate concepts and requirements feed a Pugh matrix or a trade-space exploration, and both produce a selected concept and a decision rationale.",
        },
      ],
      challenge: "Small organizations and agile teams have to live with the model. The question is how they adopt model-based systems engineering.",
      contribution: [
        "The master’s thesis takes the adoption question into the team that has to live with the model: small organizations, and agile teams.",
        "The useful model is the one a small team can keep running. The thesis is in progress.",
      ],
    },
    {
      id: "knee",
      tag: "Robotics",
      title: "Knee replacement robotic assistant",
      featured: false,
      images: [
        {
          file: "assets/kneematic/concept-selection.jpg",
          caption: "Concept selection. Highlighted options are the architecture carried forward, from control and mount through power and computing.",
          description: "Decision matrix for the surgical robot architecture, with the selected options highlighted",
        },
        {
          file: "assets/kneematic/tradespace-mount.jpg",
          caption: "Mount-type tradespace. Handheld concepts sit higher on performance for a given manufacturing cost.",
          description: "Tradespace chart of performance against manufacturing cost for bed-mounted, floor-mounted, and handheld surgical robots",
        },
        {
          file: "assets/kneematic/stakeholders.jpg",
          caption: "Stakeholder interfaces. The surgeon is primary. The other groups constrain safety, time, and adoption.",
          description: "Stakeholder map for a knee-replacement robot, with the surgeon as the primary user",
        },
      ],
      challenge: "The surgeon is the primary user. Patients, the operating room, hospitals, regulators, and insurers set the constraints: a safe procedure, surgeon control, a smaller footprint, and less time to set up and clear the room. Those needs became requirements. Cuts within 1 mm. End-to-end latency under 100 ms. Setup and cleanup under 45 minutes. Weight under 7 lb.",
      contribution: [
        "A new product generation of a surgical robot for knee reconstruction. I worked the system architecture from stakeholder needs through to the concept that was selected: what each group required, how those needs decomposed into requirements, and the tradeoffs that decided the design.",
        "The tradespace compared how the robot is mounted, powered, and navigated, and how much of the cut it controls. Handheld concepts score higher on performance for the manufacturing cost.",
        "The concept carried forward is a wireless handpiece: robotic control of position and the cutting plane, inertial navigation with an infrared camera as backup, the battery on the tool, and the computation off the device.",
      ],
      badges: ["Cuts within 1 mm", "Latency under 100 ms", "Setup under 45 min", "Under 7 lb"],
    },
    {
      id: "robotics-platform",
      tag: "More",
      title: "Robotic platform and quadrocopter",
      featured: false,
      challenge: "A robotic platform and a quadrocopter.",
      contribution: [
        "Two projects still to write up: a robotic platform and a quadrocopter.",
      ],
    },
    {
      id: "next",
      tag: "Open",
      title: "To be added",
      featured: false,
      note: [                  // plain text, used when there is no challenge or contribution yet
        "This tab is open for the next project.",
      ],
    },
  ],

  // ====================================================================
  // 7. PUBLICATIONS
  // ADD ONE: copy a block and change it. "type" is the small label on the left.
  // "url" makes the title a link. Leave it out when there is no page yet.
  // "status" is an optional line under the title, such as "Work in progress".
  // ====================================================================
  publications: [
    {
      type: "Research",
      title: "MBSE Adoption Pathways for Small and Medium-Sized Organizations",
      details: "MIT · model-based systems engineering and the digital thread",
      status: "Work in progress",
    },
    {
      type: "Paper",
      title: "Teaching the Digital Thread: Insights from the Pilot of a New Graduate-level Course Employing Model-Based Engineering",
      details: "INCOSE International Symposium 2026 · with Eric Rebentisch",
      url: "https://doi.org/10.1002/iis2.70251",
    },
    {
      type: "Paper",
      title: "Resilience Framework and Agentic AI-based Support for MBSE to Optimize Resilience in Product Development",
      details: "Tag des Systems Engineering 2026 · with Benjamin Schneider, Zhenghan Zhang, Tina Vartziotis, and Rohit Gupta",
      status: "In publication",
    },
    {
      type: "Patent",
      title: "Device for Producing Container Products",
      details: "Rommelag · DE 10 2022 118 938 · pharmaceutical packaging",
      url: "https://patents.google.com/patent/DE102022118938A1/en",
    },
    {
      type: "Patent",
      title: "Method for Producing a Container Product and Device for Implementing the Method",
      details: "Rommelag · US 12,589,543 · pharmaceutical packaging",
      url: "https://patents.google.com/patent/US12589543B2/en",
    },
    {
      type: "Patent",
      title: "Device with Associated Molding Tools and System Consisting of a Set of Molding Tools",
      details: "Rommelag · DE 10 2023 001 403 · pharmaceutical manufacturing equipment",
      url: "https://patents.google.com/patent/DE102023001403B3/en",
    },
  ],

  // ====================================================================
  // 8. CONTACT
  // The closing section. The buttons use the e-mail and LinkedIn from section 1.
  // ====================================================================
  contact: {
    title: "Start a conversation",
    text: "Open to collaboration, teaching conversations, and research on medical devices. If you are taking a device through design controls, or bringing model-based engineering and the digital thread into an agile, fast-moving team, I would welcome the chance to understand what you are working to achieve and how I can help.",
  },
};
