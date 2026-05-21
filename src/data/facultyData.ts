// ARIA Knowledge Base — FSKTM, Universiti Malaya
// Academic staff sourced from fsktm.um.edu.my and umexpert.um.edu.my
// Room assignments are plausible but not officially published.
// Block A = main building (kiosk here). Block B = theatre/lecture hall wing.

const PHOTO_BASE = "https://fsktm.um.edu.my/fsktm/staff/academic/"

const ARIA_DATA = {

  meta: {
    faculty: "Faculty of Computer Science and Information Technology",
    abbreviation: "FSKTM",
    university: "Universiti Malaya",
    location: "Ground-floor lobby kiosk, Block A",
    floors: 5,
    blocks: ["A", "B"],
    dean: "prof_loo",
    admin_email: "dekan_fsktm@um.edu.my",
    admin_phone: "+603-7967 6300",
  },

  rooms: [
    // Admin
    { id:"admin_a101", name:"Faculty Admin Office", short:"Admin", type:"admin", floor:1, block:"A", capacity:null, features:[], landmark:"Ground floor Block A, past the security desk on your right", directions_from_entrance:["Enter through the main doors","Walk straight past the security desk","The Admin Office is the first door on your right"] },

    // Lecture halls — Block B
    { id:"dkb1", name:"Dewan Kuliah B1", short:"DK B1", type:"lecture_hall", floor:1, block:"B", capacity:250, features:["projector","microphone","air_conditioning","tiered_seating"], landmark:"Block B, ground floor, main large theatre", directions_from_entrance:["Exit the main building through the glass connector","Enter Block B — the large hall is directly ahead"] },
    { id:"dkb2", name:"Dewan Kuliah B2", short:"DK B2", type:"lecture_hall", floor:1, block:"B", capacity:150, features:["projector","microphone","air_conditioning","tiered_seating"], landmark:"Block B, ground floor, second theatre hall", directions_from_entrance:["Exit the main building through the glass connector","Enter Block B","Turn right — DK B2 is beside DK B1"] },

    // Lecture halls — Block A
    { id:"dka1", name:"Dewan Kuliah A1", short:"DK A1", type:"lecture_hall", floor:1, block:"A", capacity:80, features:["projector","microphone","air_conditioning"], landmark:"Block A, ground floor, turn left from the entrance", directions_from_entrance:["Enter through the main doors","Turn left immediately","DK A1 is the hall on your right"] },
    { id:"dka2", name:"Dewan Kuliah A2", short:"DK A2", type:"lecture_hall", floor:1, block:"A", capacity:60, features:["projector","microphone","air_conditioning"], landmark:"Block A, ground floor, next to DK A1", directions_from_entrance:["Enter through the main doors","Turn left immediately","Walk past DK A1 — DK A2 is the next hall on your right"] },

    // Computer labs — Floor 2
    { id:"lab_a201", name:"Computer Lab A201", short:"Lab A201", type:"computer_lab", floor:2, block:"A", capacity:40, features:["computers","projector","whiteboard","air_conditioning"], landmark:"Block A, Floor 2, opposite the lift", directions_from_entrance:["Take the lift to Floor 2","Exit and turn left","Lab A201 is directly opposite the lift doors"] },
    { id:"lab_a202", name:"Computer Lab A202", short:"Lab A202", type:"computer_lab", floor:2, block:"A", capacity:35, features:["computers","projector","air_conditioning"], landmark:"Block A, Floor 2, beside Lab A201", directions_from_entrance:["Take the lift to Floor 2","Exit and turn left","Walk past Lab A201 — Lab A202 is the next door on your left"] },

    // Computer labs — Floor 3
    { id:"lab_a301", name:"Computer Lab A301", short:"Lab A301", type:"computer_lab", floor:3, block:"A", capacity:40, features:["computers","projector","whiteboard","air_conditioning"], landmark:"Block A, Floor 3, first lab on the left", directions_from_entrance:["Take the lift to Floor 3","Exit and turn left","Lab A301 is the first door on your left"] },
    { id:"lab_a302", name:"HCI Lab A302", short:"Lab A302", type:"computer_lab", floor:3, block:"A", capacity:30, features:["computers","projector","whiteboard","air_conditioning","usability_equipment"], landmark:"Block A, Floor 3, end of the corridor — HCI research lab", directions_from_entrance:["Take the lift to Floor 3","Exit and turn left","Walk to the end of the corridor","HCI Lab A302 is the last door on your left"] },
    { id:"lab_a303", name:"Networks Lab A303", short:"Lab A303", type:"computer_lab", floor:3, block:"A", capacity:25, features:["computers","network_equipment","projector","air_conditioning"], landmark:"Block A, Floor 3, near the fire exit", directions_from_entrance:["Take the lift to Floor 3","Exit and turn right","Lab A303 is near the fire exit on your right"] },

    // Study rooms — Floor 2
    { id:"study_a204", name:"Study Room A204", short:"Room A204", type:"study_room", floor:2, block:"A", capacity:8, features:["whiteboard","air_conditioning"], landmark:"Block A, Floor 2, quiet zone", directions_from_entrance:["Take the lift to Floor 2","Exit and turn left","Walk past the labs","Study Room A204 is in the quiet zone on your right"] },
    { id:"study_a205", name:"Study Room A205", short:"Room A205", type:"study_room", floor:2, block:"A", capacity:6, features:["whiteboard","air_conditioning"], landmark:"Block A, Floor 2, quiet zone beside A204", directions_from_entrance:["Take the lift to Floor 2","Exit and turn left","Walk past the labs","Study Room A205 is next to Room A204 in the quiet zone"] },

    // Study rooms — Floor 3
    { id:"study_a304", name:"Study Room A304", short:"Room A304", type:"study_room", floor:3, block:"A", capacity:10, features:["whiteboard","projector","air_conditioning"], landmark:"Block A, Floor 3, beside the labs", directions_from_entrance:["Take the lift to Floor 3","Exit and turn left","Walk past Lab A301 and Lab A302","Study Room A304 is at the end on your right"] },

    // Offices — Floor 3
    { id:"office_a310", name:"Office A310", short:"Room A310", type:"office", floor:3, block:"A", capacity:1, features:[], landmark:"Block A, Floor 3, AI cluster", directions_from_entrance:["Take the lift to Floor 3","Exit and turn right","Office A310 is midway down the corridor on your left"] },
    { id:"office_a311", name:"Office A311", short:"Room A311", type:"office", floor:3, block:"A", capacity:1, features:[], landmark:"Block A, Floor 3, AI cluster", directions_from_entrance:["Take the lift to Floor 3","Exit and turn right","Office A311 is beside Office A310"] },
    { id:"office_a312", name:"Office A312", short:"Room A312", type:"office", floor:3, block:"A", capacity:1, features:[], landmark:"Block A, Floor 3, CST cluster", directions_from_entrance:["Take the lift to Floor 3","Exit and turn right","Walk to the end — Office A312 is on your right"] },

    // Offices — Floor 4
    { id:"office_a410", name:"Office A410", short:"Room A410", type:"office", floor:4, block:"A", capacity:1, features:[], landmark:"Block A, Floor 4, IS cluster", directions_from_entrance:["Take the lift to Floor 4","Exit and turn left","Office A410 is the first office on your left"] },
    { id:"office_a411", name:"Office A411", short:"Room A411", type:"office", floor:4, block:"A", capacity:1, features:[], landmark:"Block A, Floor 4, IS cluster", directions_from_entrance:["Take the lift to Floor 4","Exit and turn left","Walk past A410 — Office A411 is the next door"] },
    { id:"office_a412", name:"Office A412", short:"Room A412", type:"office", floor:4, block:"A", capacity:1, features:[], landmark:"Block A, Floor 4, SE cluster", directions_from_entrance:["Take the lift to Floor 4","Exit and turn right","Office A412 is halfway down the corridor on your left"] },
    { id:"office_a413", name:"Office A413", short:"Room A413", type:"office", floor:4, block:"A", capacity:1, features:[], landmark:"Block A, Floor 4, SE cluster", directions_from_entrance:["Take the lift to Floor 4","Exit and turn right","Office A413 is beside Office A412"] },
    { id:"office_a414", name:"Office A414", short:"Room A414", type:"office", floor:4, block:"A", capacity:1, features:[], landmark:"Block A, Floor 4, SE cluster", directions_from_entrance:["Take the lift to Floor 4","Exit and turn right","Office A414 is three doors past A412 on your left"] },

    // Offices — Floor 5
    { id:"office_b501", name:"Office B501", short:"Room B501", type:"office", floor:5, block:"B", capacity:1, features:[], landmark:"Block B, Floor 5, senior professors cluster", directions_from_entrance:["Take the lift to Floor 5","Exit towards Block B","Office B501 is the first office on your right"] },
    { id:"office_b502", name:"Office B502", short:"Room B502", type:"office", floor:5, block:"B", capacity:1, features:[], landmark:"Block B, Floor 5, senior professors cluster", directions_from_entrance:["Take the lift to Floor 5","Exit towards Block B","Office B502 is beside B501"] },
    { id:"office_b503", name:"Office B503", short:"Room B503", type:"office", floor:5, block:"B", capacity:1, features:[], landmark:"Block B, Floor 5, Dean's cluster", directions_from_entrance:["Take the lift to Floor 5","Exit towards Block B","Office B503 is at the end of the corridor on your left"] },
    { id:"office_b504", name:"Office B504", short:"Room B504", type:"office", floor:5, block:"B", capacity:1, features:[], landmark:"Block B, Floor 5, Dean's cluster", directions_from_entrance:["Take the lift to Floor 5","Exit towards Block B","Office B504 is beside B503 near the photocopier"] },
  ],

  professors: [
    // Dean
    {
      id:"prof_loo", name:"Prof. Dr. Loo Chu Kiong", title:"Professor", role:"Dean",
      department:"Artificial Intelligence", office_id:"office_b503",
      email:"ckloo.um@um.edu.my", phone:"+603-7967 6395",
      photo: PHOTO_BASE + "a_ckloo_small.jpg",
      research:"Lifelong machine learning, explainable AI, robotics, affective computing, brain-inspired computing",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"09:00",to:"12:00",status:"in_office",label:"In office"},{from:"14:00",to:"16:00",status:"meeting",label:"Faculty management meeting"}],
        wednesday: [{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"12:00",status:"meeting",label:"University senate"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },

    // Artificial Intelligence
    {
      id:"dr_shahreeza", name:"Dr. Muhammad Shahreeza Safiruz Kassim", title:"Senior Lecturer", role:"Head of Department, AI",
      department:"Artificial Intelligence", office_id:"office_a310",
      email:"shahreeza@um.edu.my", phone:"+603-7967 6308",
      photo: PHOTO_BASE + "a_shahreeza_medium.jpg",
      research:"Biophysics modelling, machine learning, approximate Bayesian computation, deep learning for medical applications",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"08:00",to:"10:00",status:"teaching",label:"AI Systems — Lab A301"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"08:00",to:"10:00",status:"teaching",label:"Machine Learning — Lab A303"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"12:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"prof_chan", name:"Prof. Ir. Dr. Chan Chee Seng", title:"Professor", role:null,
      department:"Artificial Intelligence", office_id:"office_b501",
      email:"cs.chan@um.edu.my", phone:"+603-7967 6433",
      photo: PHOTO_BASE + "a_cschan.jpg",
      research:"Computer vision, machine learning, scene understanding, image and video content analysis",
      weekly_schedule:{
        monday:    [{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"09:00",to:"11:00",status:"teaching",label:"Computer Vision — DK A1"},{from:"11:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"11:00",status:"teaching",label:"Deep Learning — DK A2"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"unavailable",label:"Research day — no walk-ins"}],
      },
    },
    {
      id:"dr_liew", name:"Dr. Liew Wei Shiung", title:"Senior Lecturer", role:null,
      department:"Artificial Intelligence", office_id:"office_a311",
      email:"liew.wei.shiung.phd@um.edu.my", phone:"+603-7967 6311",
      photo: PHOTO_BASE + "a_liewweishiung.jpg",
      research:"Human-robot interaction, ELM ensembles, affective and trust modelling, lifelong learning, growing dual-memory networks",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"08:00",to:"10:00",status:"teaching",label:"HRI Systems — Lab A302"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"dr_saw", name:"Dr. Saw Shier Nee", title:"Senior Lecturer", role:null,
      department:"Artificial Intelligence", office_id:"office_a312",
      email:"sawsn@um.edu.my", phone:"+603-7967 6341",
      photo: PHOTO_BASE + "a_sawsnie_small.jpg",
      research:"AI for healthcare, machine learning, bioinformatics, medical imaging, explainable AI",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"10:00",to:"12:00",status:"teaching",label:"AI in Healthcare — DK A1"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"12:00",status:"meeting",label:"Research group"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },

    // Computer System & Technology
    {
      id:"assoc_amir", name:"Assoc. Prof. Dr. Amirrudin Kamsin", title:"Associate Professor", role:"Head of Department, CST",
      department:"Computer System & Technology", office_id:"office_b502",
      email:"amir@um.edu.my", phone:"+603-7967 6304",
      photo: PHOTO_BASE + "a_amir.jpg",
      research:"HCI, educational technology, serious games and AR for STEM, digital health, Islamic digital informatics",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"12:00",status:"in_office",label:"In office"},{from:"14:00",to:"16:00",status:"meeting",label:"Department heads meeting"}],
        tuesday:   [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"08:00",to:"10:00",status:"teaching",label:"HCI — Lab A302"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"prof_laiha", name:"Prof. Ts. Dr. Miss Laiha Mat Kiah", title:"Professor", role:null,
      department:"Computer System & Technology", office_id:"office_b504",
      email:"misslaiha@um.edu.my", phone:"+603-7967 6354",
      photo: PHOTO_BASE + "a_misslaiha_small.jpg",
      research:"Cybersecurity, group key management, BYOD security policy, blockchain scalability, authentication",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"08:00",to:"10:00",status:"teaching",label:"Network Security — DK A2"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"08:00",to:"10:00",status:"teaching",label:"Cybersecurity — DK B1"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"unavailable",label:"Research writing day"}],
      },
    },
    {
      id:"assoc_ismail", name:"Assoc. Prof. Ts. Dr. Ismail Ahmedy", title:"Associate Professor", role:null,
      department:"Computer System & Technology", office_id:"office_a312",
      email:"ismailahmedy@um.edu.my", phone:"+603-7967 6418",
      photo: PHOTO_BASE + "a_ismail_small.jpg",
      research:"Wireless sensor networks, IoT, mobile cloud computing, VANETs, machine learning for IoT security",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"10:00",to:"12:00",status:"teaching",label:"IoT Systems — Lab A303"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"12:00",status:"meeting",label:"C4MCCR research centre"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"dr_faiz", name:"Ts. Dr. Muhammad Faiz Mohd Zaki", title:"Senior Lecturer", role:null,
      department:"Computer System & Technology", office_id:"office_a310",
      email:"faizzaki@um.edu.my", phone:"+603-7967 6418",
      photo: PHOTO_BASE + "a_faiz.jpg",
      research:"Network analytics, IoT device identification, traffic classification, machine learning for networks, federated learning",
      weekly_schedule:{
        monday:    [{from:"08:00",to:"10:00",status:"teaching",label:"Network Analytics — Lab A303"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"08:00",to:"10:00",status:"teaching",label:"Data Communications — DK A2"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"12:00",status:"in_office",label:"In office"}],
      },
    },

    // Software Engineering
    {
      id:"dr_asmiza", name:"Dr. Asmiza Abdul Sani", title:"Senior Lecturer", role:"Head of Department, SE",
      department:"Software Engineering", office_id:"office_a412",
      email:"asmiza@um.edu.my", phone:"+603-7967 6438",
      photo: PHOTO_BASE + "dr.asmiza2.png",
      research:"Model-driven engineering, software-engineering education, algorithm design, real-time systems, software-defect prediction",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"08:00",to:"10:00",status:"teaching",label:"Software Engineering — DK A1"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"},{from:"14:00",to:"16:00",status:"meeting",label:"Department meeting"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"assoc_raja_jamilah", name:"Assoc. Prof. Dr. Raja Jamilah Raja Yusof", title:"Associate Professor", role:null,
      department:"Software Engineering", office_id:"office_a413",
      email:"rjry@um.edu.my", phone:"+603-7967 6439",
      photo: PHOTO_BASE + "a_rjry_small_3.jpg",
      research:"Usability of interfaces, big-data visualisation, design and analysis of algorithms, computational thinking",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"08:00",to:"10:00",status:"teaching",label:"User Interface Design — Lab A302"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"},{from:"16:00",to:"18:00",status:"teaching",label:"Algorithms — DK A1"}],
        thursday:  [{from:"09:00",to:"12:00",status:"meeting",label:"Student supervision"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"prof_hafizah", name:"Prof. Dr. Siti Hafizah Ab Hamid", title:"Professor", role:"Deputy Dean, Development",
      department:"Software Engineering", office_id:"office_b503",
      email:"sitihafizah@um.edu.my", phone:"+603-7967 6424",
      photo: PHOTO_BASE + "sitihafizah_small.jpg",
      research:"Software quality, software testing, software reliability, mobile applications, AI-based software automation",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"12:00",status:"meeting",label:"Deputy Dean duties"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"08:00",to:"10:00",status:"teaching",label:"Software Quality — DK A2"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"unavailable",label:"University committee"}],
      },
    },
    {
      id:"dr_hazim", name:"Ts. Dr. Mohamad Hazim Md Hanif", title:"Senior Lecturer", role:null,
      department:"Software Engineering", office_id:"office_a414",
      email:"hazimhanif@um.edu.my", phone:"+603-7967 7022",
      photo: PHOTO_BASE + "a_hazim.jpg",
      research:"Computer and software security, deep representation learning, software vulnerability detection, ML for cybersecurity",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"10:00",to:"12:00",status:"teaching",label:"Software Security — Lab A303"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"12:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"dr_nazean", name:"Dr. Nazean Jomhari", title:"Senior Lecturer", role:null,
      department:"Software Engineering", office_id:"office_a413",
      email:"nazean@um.edu.my", phone:"+603-7967 2513",
      photo: PHOTO_BASE + "a_nazean_small.jpg",
      research:"HCI, UI/UX design, special-education applications, autism and Down syndrome software, Quranic app design",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"10:00",to:"12:00",status:"teaching",label:"HCI — Lab A302"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"12:00",status:"in_office",label:"In office"},{from:"14:00",to:"16:00",status:"meeting",label:"Research group"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },

    // Information Systems
    {
      id:"dr_hoo", name:"Dr. Hoo Wai Lam", title:"Senior Lecturer", role:"Head of Department, IS",
      department:"Information Systems", office_id:"office_a410",
      email:"wlhoo@um.edu.my", phone:"+603-7967 6303",
      photo: PHOTO_BASE + "a_hoowailam.jpg",
      research:"Expert systems, machine learning, pattern and image recognition, video saliency detection, computer vision",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"08:00",to:"10:00",status:"teaching",label:"Information Systems — DK A1"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"12:00",status:"meeting",label:"Department heads"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"prof_liyana", name:"Prof. Dr. Nor Liyana Mohd Shuib", title:"Professor", role:"Deputy Dean, Undergraduate",
      department:"Information Systems", office_id:"office_b501",
      email:"liyanashuib@um.edu.my", phone:"+603-7967 6301",
      photo: PHOTO_BASE + "a_liana.jpg",
      research:"Personalisation, e-learning, recommender systems, data science and analytics, educational technology",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"12:00",status:"meeting",label:"Deputy Dean duties"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"08:00",to:"10:00",status:"teaching",label:"Data Science — Lab A201"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"prof_vimala", name:"Prof. Ts. Dr. Vimala Balakrishnan", title:"Professor", role:null,
      department:"Information Systems", office_id:"office_b502",
      email:"vimala.balakrishnan@um.edu.my", phone:"+603-7967 6377",
      photo: PHOTO_BASE + "a_vimala.jpg",
      research:"Data science and analytics, social-media analytics, sentiment analysis, NLP, cyberbullying detection",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"10:00",to:"12:00",status:"teaching",label:"Social Media Analytics — DK A2"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"12:00",status:"meeting",label:"Research supervision"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"unavailable",label:"External appointment"}],
      },
    },
    {
      id:"assoc_kasturi", name:"Assoc. Prof. Dr. Kasturi Dewi Varathan", title:"Associate Professor", role:null,
      department:"Information Systems", office_id:"office_a411",
      email:"kasturi@um.edu.my", phone:"+603-7967 2512",
      photo: PHOTO_BASE + "a_kasturi.jpg",
      research:"Text mining, data analytics, information retrieval, health informatics, opinion and sentiment mining",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"08:00",to:"10:00",status:"teaching",label:"Text Mining — Lab A201"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"assoc_suraya", name:"Assoc. Prof. Dr. Suraya Hamid", title:"Associate Professor", role:null,
      department:"Information Systems", office_id:"office_a411",
      email:"suraya_hamid@um.edu.my", phone:"+603-7967 2501",
      photo: PHOTO_BASE + "a_surayahamid_small.jpg",
      research:"Information systems, online social technologies, learning analytics, e-government, green IS, health informatics",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"10:00",to:"12:00",status:"teaching",label:"E-Government Systems — DK A1"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"12:00",status:"in_office",label:"In office"}],
      },
    },

    // Multimedia
    {
      id:"mdm_masidayu", name:"Mdm. Mas Idayu Md. Sabri", title:"Lecturer", role:"Head, Multimedia Unit",
      department:"Multimedia", office_id:"office_a412",
      email:"masidayu@um.edu.my", phone:"+603-7967 2505",
      photo: PHOTO_BASE + "a_masidayu2_small.jpg",
      research:"Game-based learning, serious games, edutainment, augmented reality, interactive design, audio synthesis",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"08:00",to:"10:00",status:"teaching",label:"Interactive Media — Lab A202"},{from:"10:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"10:00",to:"12:00",status:"teaching",label:"Game Design — Lab A202"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"assoc_nor_aniza", name:"Assoc. Prof. Dr. Nor Aniza Abdullah", title:"Associate Professor", role:null,
      department:"Multimedia", office_id:"office_a414",
      email:"noraniza@um.edu.my", phone:"+603-7967 6352",
      photo: PHOTO_BASE + "a_noraniza.jpg",
      research:"Multimedia systems, deep learning for medical imaging, spatial task allocation, machine learning in emotional intelligence",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"08:00",to:"10:00",status:"teaching",label:"Multimedia Systems — Lab A202"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"12:00",status:"in_office",label:"In office"},{from:"14:00",to:"16:00",status:"meeting",label:"Research group"}],
        friday:    [{from:"09:00",to:"13:00",status:"in_office",label:"In office"}],
      },
    },
    {
      id:"dr_fazmidar", name:"Dr. Nurul Fazmidar Mohd Noor", title:"Senior Lecturer", role:null,
      department:"Multimedia", office_id:"office_a413",
      email:"fazmidar@um.edu.my", phone:"+603-7967 6374",
      photo: PHOTO_BASE + "a_fazmidar_small.jpg",
      research:"Affective computing, serious games, gamification, 3D information visualisation, VR, image-splicing forgery detection",
      weekly_schedule:{
        monday:    [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        tuesday:   [{from:"10:00",to:"12:00",status:"teaching",label:"3D Visualisation — Lab A202"},{from:"14:00",to:"17:00",status:"in_office",label:"In office"}],
        wednesday: [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        thursday:  [{from:"09:00",to:"17:00",status:"in_office",label:"In office"}],
        friday:    [{from:"09:00",to:"12:00",status:"in_office",label:"In office"}],
      },
    },
  ],

  todays_room_schedule: {
    lab_a302: [
      {from:"08:00",to:"10:00",status:"occupied",label:"HRI Systems — Dr. Liew Wei Shiung"},
      {from:"10:00",to:"14:00",status:"available",label:""},
      {from:"14:00",to:"16:00",status:"occupied",label:"HCI — Dr. Nazean Jomhari"},
      {from:"16:00",to:"19:00",status:"available",label:""},
    ],
    lab_a301: [
      {from:"08:00",to:"10:00",status:"occupied",label:"AI Systems — Dr. Shahreeza"},
      {from:"10:00",to:"19:00",status:"available",label:""},
    ],
    lab_a201: [
      {from:"08:00",to:"10:00",status:"occupied",label:"Text Mining — Assoc. Prof. Kasturi"},
      {from:"10:00",to:"14:00",status:"available",label:""},
      {from:"14:00",to:"16:00",status:"occupied",label:"Data Science — Prof. Liyana"},
      {from:"16:00",to:"19:00",status:"available",label:""},
    ],
    lab_a202: [
      {from:"08:00",to:"10:00",status:"occupied",label:"Interactive Media — Mdm. Mas Idayu"},
      {from:"10:00",to:"19:00",status:"available",label:""},
    ],
    lab_a303: [
      {from:"08:00",to:"10:00",status:"occupied",label:"Network Analytics — Dr. Faiz"},
      {from:"10:00",to:"14:00",status:"available",label:""},
      {from:"14:00",to:"16:00",status:"occupied",label:"Software Security — Dr. Hazim"},
      {from:"16:00",to:"19:00",status:"available",label:""},
    ],
    dka1: [
      {from:"08:00",to:"10:00",status:"occupied",label:"Software Engineering — Dr. Asmiza"},
      {from:"10:00",to:"12:00",status:"available",label:""},
      {from:"12:00",to:"14:00",status:"occupied",label:"Information Systems — Dr. Hoo"},
      {from:"14:00",to:"19:00",status:"available",label:""},
    ],
    dka2: [
      {from:"08:00",to:"10:00",status:"occupied",label:"Network Security — Prof. Laiha"},
      {from:"10:00",to:"12:00",status:"occupied",label:"Social Media Analytics — Prof. Vimala"},
      {from:"12:00",to:"19:00",status:"available",label:""},
    ],
    dkb1: [
      {from:"08:00",to:"10:00",status:"occupied",label:"Cybersecurity — Prof. Laiha"},
      {from:"10:00",to:"19:00",status:"available",label:""},
    ],
    dkb2: [
      {from:"08:00",to:"19:00",status:"available",label:""},
    ],
    study_a204: [
      {from:"08:00",to:"13:00",status:"available",label:""},
      {from:"13:00",to:"15:00",status:"occupied",label:"Booked — study group"},
      {from:"15:00",to:"19:00",status:"available",label:""},
    ],
    study_a205: [
      {from:"08:00",to:"19:00",status:"available",label:""},
    ],
    study_a304: [
      {from:"08:00",to:"11:00",status:"occupied",label:"Booked — FYP group"},
      {from:"11:00",to:"19:00",status:"available",label:""},
    ],
  } as Record<string, {from:string,to:string,status:string,label:string}[]>,

  todays_events: [
    {id:"evt001", title:"Faculty Research Colloquium",      from:"14:00", to:"16:00", location:"DK B1, Block B",                    open_to:"All students and staff",   description:"Monthly research presentations by FSKTM faculty members. Refreshments provided."},
    {id:"evt002", title:"Tech Career Fair 2026",             from:"10:00", to:"17:00", location:"Ground Floor Foyer, Block A",        open_to:"All",                       description:"Representatives from local and international tech companies. Bring your resume and student ID."},
    {id:"evt003", title:"FYP Viva — Batch 2025/2026",       from:"09:00", to:"13:00", location:"DK A1 and Study Rooms, Floor 3",    open_to:"Final year students",       description:"Final Year Project oral presentations. Panelists and presenting students only beyond the waiting area."},
    {id:"evt004", title:"Python for Data Science Workshop",  from:"15:00", to:"17:00", location:"Lab A303, Floor 3",                  open_to:"Registered participants",   description:"Hands-on workshop. Registration required via the faculty portal."},
    {id:"evt005", title:"Postgraduate Orientation",          from:"09:00", to:"11:00", location:"DK B2, Block B",                    open_to:"New postgraduate students", description:"Briefing for new MSc and PhD students. Attendance mandatory. Bring your offer letter."},
  ],
}


// ─── Derived exports (same shape expected by schedule.ts / localFallback.ts) ─

function resolveOffice(officeId: string): string {
  const room = ARIA_DATA.rooms.find(r => r.id === officeId)
  return room ? room.name : officeId
}

export const ROOMS = ARIA_DATA.rooms.map(r => ({
  id:        r.id,
  name:      r.name,
  short:     r.short,
  type:      r.type,
  floor:     r.floor,
  block:     r.block,
  capacity:  r.capacity,
  features:  r.features,
  landmark:  r.landmark,
  directions: r.directions_from_entrance,
}))

export const PROFESSORS = ARIA_DATA.professors.map(p => ({
  id:         p.id,
  name:       p.name,
  title:      p.title,
  role:       p.role,
  department: p.department,
  office:     resolveOffice(p.office_id),
  email:      p.email,
  phone:      p.phone,
  photo:      p.photo,
  research:   p.research,
}))

export const PROF_SCHEDULES: Record<string, Record<string, {from:string,to:string,status:string,label:string}[]>> =
  Object.fromEntries(ARIA_DATA.professors.map(p => [p.id, p.weekly_schedule]))

export const ROOM_SCHEDULES = ARIA_DATA.todays_room_schedule

export const TODAY_EVENTS = ARIA_DATA.todays_events
