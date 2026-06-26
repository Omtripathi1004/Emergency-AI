# Project Documentation: Emergency AI Command Console

**Track**: Agents for Good  
**Project Scope**: Capstone Project - Disaster Assessment & Response Command Center  
**Target Scenario**: Monsoons, Cyclones, Earthquakes, Landslides, and Road Accidents  
**Key Implementation**: Vanilla HTML5, CSS3, JS Canvas, and BFS Pathfinding Algorithms

---

## 1. Executive Summary / Abstract
In times of extreme weather events and natural disasters, cellular bandwidth collapses, power grids fail, and critical information becomes highly fragmented. Citizens find themselves stranded without clear guidance on safe evacuation routes, shelter capacities, medical hotlines, or custom supplies lists.

**Emergency AI** is a lightweight, responsive, client-side Command Console designed to provide real-time situational awareness and emergency support to both affected citizens and rescue coordinators. Built to prioritize performance on low-bandwidth emergency links or fully offline local intranet nodes, the console integrates visual mapping, automated pathfinding, natural language triage analysis, and supply optimization into a glassmorphic dashboard interface.

---

## 2. Problem Statement
During severe crises (e.g., Bay of Bengal Cyclones or Himalayan Landslips):
* **Evacuation Blindness**: Citizens make critical routing decisions without knowing which roads are blocked by floods or debris, leading to vehicle entrapments.
* **Shelter Disorganization**: Displaced families head to generic shelters without knowing if they have exceeded capacity, causing over-crowding in select shelters while others remain empty.
* **Paramedic Dispatch Bottlenecks**: Emergency centers are overwhelmed by high-call volumes. Responders cannot quickly classify critical trauma cases from basic supply requests, delaying life-saving support.
* **Supply Resource Deficits**: Citizens pack survival kits without factoring in threat-specific necessities (e.g., waders for flooding, whistles for landslides) or group-specific consumption rates (water/food duration counts).

---

## 3. Overall System Architecture

The command center integrates three key asynchronous loops: the Map Visual Rendering loop, the User Decision / Pathfinding logic, and the AI Incident Triage processor.

```mermaid
graph TD
    UI[HTML5 Command Dashboard CSS Glassmorphism]
    State[Central App State app.js]
    Canvas[Canvas Radar/Weather Rendering]
    Triage[Natural Language Triage Engine]
    Router[BFS Safe Route Finder]
    Checklist[Dynamic Supply Kit Compiler]
    
    UI --> State
    State --> Canvas
    State --> Triage
    State --> Router
    State --> Checklist
```

```mermaid
graph TD
    User([User Entry]) --> Nav{Select Module}
    
    Nav -->|AI Dashboard| Dash[Dashboard & Map Canvas]
    Nav -->|Safe Shelters| Shelters[Shelter Capacity & Occupancy]
    Nav -->|Safe Routes| Routes[BFS Route Safety Calculator]
    Nav -->|First Aid & SOS| Triage[AI Triage & Chat console]
    Nav -->|Supplies Checklist| Supplies[Checklist Generator]
    
    Dash --> CanvasLoop[Canvas Animation Loop <br> Radar, Weather, Dispatch Cars]
    Routes --> BFSAlgorithm[BFS Graph Solver <br> Excludes Blocked Edges]
    Triage --> RegexParser[Regex Keyword Priority Evaluator]
    Supplies --> ConfigBuilder[Manifest Quantity Calculator]
```

---

## 4. Detailed Module Workflows

### A. Live Hazard & Radar Map (Visual Layer)
* **Technology**: HTML5 Canvas 2D Rendering Context & RequestAnimationFrame.
* **Core Logic**: Draws a real-time spatial command overlay representing nodes (sectors) and links (highways). Active hazard circles (danger zones) pulse dynamically.
* **Weather Satellite Radar**: Integrates an overlay of shifting monsoon precipitation circles to visually track storm fronts.
* **Active Dispatch Vectors**: When a dispatch request is accepted, a rescue unit node is spawned at the central hub and moves along coordinate lines to the target sector in real-time.

```mermaid
flowchart TD
    Start([User types request in Triage Console]) --> Input[Receive Message text & location sector]
    Input --> Analyze{Keyword Analysis}
    
    Analyze -->|Trapped/Bleeding/Drowning| SetCritical[Set Priority: CRITICAL]
    Analyze -->|Fracture/Burns/Pain| SetHigh[Set Priority: HIGH]
    Analyze -->|Lost/Need Food/Water| SetMedium[Set Priority: MEDIUM]
    Analyze -->|Inquiries/General| SetLow[Set Priority: LOW]
    
    SetCritical --> Dispatch1[Mobilize NDRF Rescue Boat]
    SetHigh --> Dispatch2[Queue 108 Emergency Ambulance]
    SetMedium --> Dispatch3[Queue SDMA Supply Truck]
    SetLow --> Dispatch4[Display General Guidance]
    
    Dispatch1 & Dispatch2 & Dispatch3 --> SpawnCar[Spawn Animated Vehicle at Central Sector D]
    SpawnCar --> CanvasDraw[Animate vehicle node along coordinate links to Target Sector]
    CanvasDraw --> ReachTarget{Reach target?}
    
    ReachTarget -->|No| CanvasDraw
    ReachTarget -->|Yes| SecureZone[Mark sector status SECURED on Radar Map]
    SecureZone --> NewsUpdate[Append Success log to Damage Feed]
    NewsUpdate --> End([Triage Process Complete])
```

---

### B. Safe Path Route Finder (Algorithm Layer)
* **Technology**: Breadth-First Search (BFS) graph traversal.
* **Core Logic**: Models local sectors as graph vertices and highways as edges. Roads marked as `blocked` (flooded or obstructed by debris) are dynamically excluded from search paths.
* **User Value**: Users input their current sector and desired shelter. The BFS algorithm calculates the shortest path that bypasses hazard sectors. If a connection is completely blocked, the system flags it as `INACCESSIBLE` and recommends alternative bypass corridors.

```mermaid
flowchart TD
    Start([Input: Origin Sector, Target Shelter]) --> LoadGraph[Load Graph: Sectors A-F as Vertices]
    LoadGraph --> LoadRoads[Load Edges: Roads connecting Sectors]
    LoadRoads --> FilterEdges[Verify road status parameters]
    
    FilterEdges --> Split{Is segment blocked?}
    Split -->|Yes| RemoveEdge[Exclude Edge from BFS search queue]
    Split -->|No| KeepEdge[Retain Edge in active BFS list]
    
    KeepEdge --> BFS[Initialize BFS Search Queue starting at Origin]
    RemoveEdge --> BFS
    
    BFS --> Search{Path to destination exists?}
    Search -->|Yes| PathFound[Trace node sequences & compute distance]
    Search -->|No| AltSearch[BFS search including blocked roads]
    
    PathFound --> RenderSafe[Highlight path in Cyan on Route Canvas]
    RenderSafe --> StatusSafe[Set Status: PATH SECURE]
    
    AltSearch --> RenderWarning[Highlight path in Red on Route Canvas]
    RenderWarning --> StatusWarning[Set Status: PATH BLOCKED / HAZARDS DETECTED]
    
    StatusSafe & StatusWarning --> End([Render Route Output to user])
```

---

### C. Supplies Checklist Compiler (Optimization Layer)
* **Technology**: JavaScript state arrays and CSS Print styling rules.
* **Core Logic**: Accepts parameters for group count, threat duration, and disaster type. Generates target quantities (e.g., ORS sachet rations, water volumes) and threat-specific equipment (e.g., waders for flooding, whistle for landslides).
* **Print Utility**: Styled with `@media print` rules, allowing families to print physical copy checklists that exclude all menus, navigation sidebars, and active maps.

```mermaid
flowchart TD
    Start([Select Scenario, Group Size, Duration]) --> LoadBase[Load Base Medication & First Aid items]
    LoadBase --> ScaleRations[Calculate water & food: size * duration * multiplier]
    
    ScaleRations --> ScenarioCheck{Disaster Scenario Selection}
    
    ScenarioCheck -->|Monsoon Flood| Flood[Add Chlorine tablets, Dry bags, Wading shoes]
    ScenarioCheck -->|Landslip / Seismic| Earth[Add Whistle, Rubble gloves, Steel-toe boots]
    ScenarioCheck -->|Cyclone Storm| Storm[Add Tarpaulins, Ropes, Weather radio]
    ScenarioCheck -->|Highway Accident| Accident[Add Reflective vests, Trauma tourniquets]
    
    Flood & Earth & Storm & Accident --> CreateManifest[Assemble checklist elements on DOM]
    CreateManifest --> CheckboxChange{User toggles checkbox}
    
    CheckboxChange --> UpdateBar[Re-calculate checked/total ratio]
    UpdateBar --> RenderProgress[Update progress bar fill percentage]
    
    RenderProgress --> Action{User prints list}
    Action --> PrintCSS[Apply Print CSS: hide map, menus, and sidebars]
    PrintCSS --> End([Generate PDF / Printed checklist page])
```

---

## 5. Technical Stack & Architecture Details
This project is built using vanilla, lightweight frontend technologies designed to run offline or over low-bandwidth emergency links:

* **Markup Layer**: Semantic HTML5 elements (`index.html`) using inline SVGs for responsive, crisp iconography loading without network dependencies.
* **Styling Layer**: Modern CSS3 (`style.css`) implementing variable tokens, glassmorphism, responsive grids, and print-media optimization overlays.
* **Execution & Routing Logic**: Client-side JavaScript (`app.js`) handling custom closures, BFS search solvers, regex triage analysis, canvas animations, and state binding listeners.

---

## 6. Social Impact & "Agents for Good" Value
* **Offline Resilience**: By executing entirely on the client-side (no external database queries or bulky JS frameworks), the console can be hosted locally on small battery-powered routers, emergency mesh networks, or cached offline on personal devices.
* **Load Reduction on First Responders**: Automating triage allows dispatch controllers to prioritize rescue boats for stranded individuals over routine resource requests.
* **Resource Optimization**: Directing citizens to high-vacancy shelters (like Guindy Delta) prevents overcrowding at central arenas (like Nungambakkam Beta).
* **Clear Action Guides**: Providing instant offline medical references (CPR, tourniquets) empowers citizens to act as immediate first responders.

---

## 7. Future Roadmap
1. **P2P Mesh Network Integration**: Utilizing WebRTC to share local shelter occupancy and hazard alerts directly between nearby mobile phones without cell towers.
2. **Offline GIS Integration**: Swapping the vector coordinate grid for offline-cached OpenStreetMap (OSM) tile rendering.
3. **SMS / USSD Gateway**: Enabling users with standard cellular connections to text their triage queries and receive automated routing replies.
