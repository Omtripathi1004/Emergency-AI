# Emergency AI - Process Workflows & Flow Diagrams

This document contains structural flowcharts mapping the core algorithmic operations and user interactions of the **Emergency AI** Command Console.

---

## 1. Overall System Architecture

The command center integrates three key asynchronous loops: the Map Visual Rendering loop, the User Decision / Pathfinding logic, and the AI Incident Triage processor.

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

## 2. SOS Emergency Triage & Dispatch Flow

This flowchart describes the automated pipeline triggered when a citizen submits an emergency request through the triage bot interface.

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

## 3. BFS Safe Route Calculator Flow

This diagram outlines how the pathfinder searches the sector graph to find a safe path to shelters while bypassing active disaster areas and landslides.

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

## 4. Emergency Supplies Configurator Flow

Details the logic used to create custom checklists and export/print them for physical packing.

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
