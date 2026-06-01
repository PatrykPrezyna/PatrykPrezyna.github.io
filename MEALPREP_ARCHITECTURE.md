# Mealprep Module - System Architecture

## Component Architecture

```mermaid
graph TB
    subgraph "User Interface Layer"
        UI[mealprep.html]
        NAV[Navigation Bar]
        WHEEL[Wheel of Fortune Component]
        RECIPES[Recipe List Component]
        FORM[Recipe Form Component]
        STATS[Statistics Dashboard]
        MODAL[Recipe Detail Modal]
    end
    
    subgraph "Application Layer"
        APP[Vue.js App - mealprep-app.js]
        STATE[Application State]
        LOGIC[Business Logic]
    end
    
    subgraph "Data Layer"
        STORAGE[LocalStorage API]
        RECIPES_DATA[Recipes JSON]
        HISTORY_DATA[Cooking History JSON]
        SETTINGS_DATA[Settings JSON]
    end
    
    UI --> APP
    NAV --> APP
    WHEEL --> APP
    RECIPES --> APP
    FORM --> APP
    STATS --> APP
    MODAL --> APP
    
    APP --> STATE
    APP --> LOGIC
    
    STATE --> STORAGE
    LOGIC --> STORAGE
    
    STORAGE --> RECIPES_DATA
    STORAGE --> HISTORY_DATA
    STORAGE --> SETTINGS_DATA
```

## Data Flow - Wheel of Fortune

```mermaid
sequenceDiagram
    participant User
    participant Wheel
    participant Algorithm
    participant History
    participant Storage
    
    User->>Wheel: Click Spin Button
    Wheel->>History: Get Cooking History
    History->>Storage: Load from LocalStorage
    Storage-->>History: Return History Data
    History-->>Wheel: History Data
    
    Wheel->>Algorithm: Calculate Weights
    Algorithm->>Algorithm: For each recipe calculate weight based on frequency and recency
    Algorithm-->>Wheel: Weighted Recipe List
    
    Wheel->>Wheel: Perform Weighted Random Selection
    Wheel->>Wheel: Animate Spinning
    Wheel-->>User: Display Selected Recipe
    
    User->>Wheel: Confirm Cooked
    Wheel->>History: Add Cooking Event
    History->>Storage: Save to LocalStorage
    Storage-->>History: Confirm Saved
    History-->>Wheel: Update Complete
    Wheel-->>User: Show Success Message
```

## Recipe Management Flow

```mermaid
stateDiagram-v2
    [*] --> RecipeList: Load Page
    
    RecipeList --> AddRecipe: Click Add Button
    RecipeList --> ViewRecipe: Click Recipe Card
    RecipeList --> SearchFilter: Enter Search/Filter
    
    AddRecipe --> RecipeForm: Show Form
    RecipeForm --> ValidateData: Submit Form
    ValidateData --> SaveRecipe: Valid
    ValidateData --> RecipeForm: Invalid - Show Errors
    SaveRecipe --> RecipeList: Success
    
    ViewRecipe --> RecipeDetail: Show Modal
    RecipeDetail --> EditRecipe: Click Edit
    RecipeDetail --> DeleteRecipe: Click Delete
    RecipeDetail --> RecipeList: Close Modal
    
    EditRecipe --> RecipeForm: Load Data
    
    DeleteRecipe --> ConfirmDelete: Show Confirmation
    ConfirmDelete --> RemoveRecipe: Confirm
    ConfirmDelete --> RecipeDetail: Cancel
    RemoveRecipe --> RecipeList: Success
    
    SearchFilter --> RecipeList: Update Display
    
    RecipeList --> [*]: Close Page
```

## Smart Selection Algorithm Flow

```mermaid
flowchart TD
    Start([Start: Spin Wheel]) --> GetRecipes[Get All Recipes]
    GetRecipes --> GetHistory[Get Cooking History]
    GetHistory --> Loop{For Each Recipe}
    
    Loop -->|Next Recipe| CheckCooked{Ever Cooked?}
    
    CheckCooked -->|No| HighWeight[Weight = 100 - Highest Priority]
    CheckCooked -->|Yes| CalcDays[Calculate Days Since Last Cooked]
    
    CalcDays --> CalcTimes[Calculate Times Cooked]
    CalcTimes --> CalcRecency[Recency Weight = min 50, days * 2]
    CalcRecency --> CalcFreq[Frequency Weight = max 1, 50 - times * 5]
    CalcFreq --> SumWeight[Total Weight = Recency + Frequency]
    
    HighWeight --> StoreWeight[Store Weight]
    SumWeight --> StoreWeight
    
    StoreWeight --> Loop
    
    Loop -->|Done| CalcTotal[Calculate Total Weight Sum]
    CalcTotal --> GenRandom[Generate Random Number 0 to Total]
    GenRandom --> SelectLoop{Iterate Recipes}
    
    SelectLoop --> SubtractWeight[Subtract Recipe Weight from Random]
    SubtractWeight --> CheckZero{Random <= 0?}
    
    CheckZero -->|Yes| Selected[Return Selected Recipe]
    CheckZero -->|No| SelectLoop
    
    Selected --> Animate[Animate Wheel Spin]
    Animate --> Display[Display Result]
    Display --> End([End])
```

## LocalStorage Structure

```mermaid
erDiagram
    RECIPES ||--o{ COOKING_HISTORY : "has many"
    
    RECIPES {
        string id PK
        string name
        array ingredients
        string instructions
        number prepTime
        number cookTime
        number servings
        string difficulty
        array tags
        string imageUrl
        datetime createdAt
        datetime updatedAt
    }
    
    COOKING_HISTORY {
        string id PK
        string recipeId FK
        datetime cookedAt
        boolean confirmed
    }
    
    SETTINGS {
        string theme
        boolean soundEnabled
        string defaultView
        string sortPreference
    }
```

## Component Hierarchy

```
MealPrepApp (Root)
├── NavigationBar
│   ├── Logo
│   ├── ThemeToggle
│   └── BackButton
│
├── MainContainer
│   ├── WheelSection
│   │   ├── WheelCanvas
│   │   ├── SpinButton
│   │   ├── ResultDisplay
│   │   └── ConfirmButton
│   │
│   ├── StatisticsSection
│   │   ├── TotalRecipes
│   │   ├── TotalCooked
│   │   ├── MostCooked
│   │   └── LeastCooked
│   │
│   └── RecipeSection
│       ├── SearchBar
│       ├── FilterControls
│       ├── SortControls
│       ├── AddRecipeButton
│       └── RecipeGrid
│           └── RecipeCard (multiple)
│               ├── RecipeImage
│               ├── RecipeName
│               ├── DifficultyBadge
│               ├── TimeInfo
│               ├── TagList
│               ├── CookingStats
│               └── ActionButtons
│
├── RecipeFormModal
│   ├── FormFields
│   ├── IngredientsList
│   ├── TagsInput
│   └── SubmitButton
│
├── RecipeDetailModal
│   ├── RecipeHeader
│   ├── RecipeImage
│   ├── IngredientsList
│   ├── Instructions
│   ├── CookingHistory
│   └── ActionButtons
│
└── ExportImportModal
    ├── ExportButton
    ├── ImportInput
    └── ClearDataButton
```

## Key Features Implementation

### 1. Wheel of Fortune Animation
- Canvas-based rendering for smooth animation
- Easing function for realistic deceleration
- Sound effects on spin and selection
- Visual feedback during spinning

### 2. Smart Selection
- Weight-based probability distribution
- Considers both frequency and recency
- Ensures variety in meal selection
- Prevents repetitive cooking patterns

### 3. Data Persistence
- All data stored in LocalStorage
- Automatic save on every change
- Export/Import for backup
- Data validation on import

### 4. Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Adaptive layouts for different screen sizes
- Optimized wheel for mobile devices

## Performance Considerations

1. **Lazy Loading**: Recipe images loaded on demand
2. **Debouncing**: Search input debounced to reduce re-renders
3. **Virtual Scrolling**: For large recipe lists (future enhancement)
4. **Efficient Filtering**: Client-side filtering with optimized algorithms
5. **Minimal Re-renders**: Vue.js reactivity optimized for performance

## Security & Data Integrity

1. **Input Validation**: All user inputs validated before storage
2. **XSS Prevention**: Sanitize user-generated content
3. **Data Backup**: Regular export reminders
4. **Error Handling**: Graceful degradation on storage errors
5. **Data Migration**: Version checking for future updates