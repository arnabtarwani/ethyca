# Ethyca Typescript Techincal Challenge

## Requirements

To get started with this project, you need to have the following installed on your local machine. The assumption is that you are using Mac for the development.

- [Bun](https://bun.com/docs/installation)
- [Node.js](https://nodejs.org/en/download/)

## Tech Stack 

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vite.dev/)
- [Bun](https://bun.com/)

## Installation & Usage

1. Clone the repository
2. Run `bun install` to install the dependencies
3. Run `bun dev` to start the development server
4. Open the browser and navigate to `http://localhost:5173`

```
git clone https://github.com/arnabtarwani/ethyca.git
cd ethyca
bun install
bun dev
```

## Project Structure

```
ethyca/
├── src/
│   ├── components/ - Contains all the main components of the app.
│   └── hooks/ - Contains all the custom hooks of the app.
│   └── pages/ - Contains all the pages of the app. currently only contains the `app.tsx` page.
│   └── styles/ - Contains the global styles of the app.
│   └── types/ - Contains all the common types of the app.
│   └── utils/ - Contains all the utility functions of the app including the sample data.
│   └── main.tsx - The main entry point of the app.
```

## Time Investment

Overall I spent ~5 hours on the challenge although the requirement was between 3 and 4 hrs. However, I wanted to spend some time on the styling and the overall layout to make it more presentable and user-friendly. The breakdown is as follows: 

- 2h on the data modeling and parsing the sample data. Including understanding the dataset and defining the type requirements which are defined in `types/types.ts`. 

- 1.5h on designing, mapping and creating the data map component along with the dependencies including filters which are: 

```
- system-card.tsx
- data-map.tsx
- data-categories.tsx
- data-subjects.tsx
- privacy-declarations.tsx
- system-dependencies.tsx
- filter-controls.tsx
```

- 1h on designing and creating the logic for the dialog, react-flow and side-panel in the dialog and handling the onClick functionality of the nodes. 

- 0.5h on styling the components and the overall layout.

## Assumptions & Tradeoffs

### Assumptions 

1. Circular dependencies are fine - The system lets A depend on B, B depend on C, and C loop back to A. React Flow doesn't complain, but in the production app, these cycles might signal design problems I should flag.

2. Everyone can see everything - I'm showing all systems in one view, but this is privacy data. In the production app, you'd need role-based access control since some systems handle sensitive info that not everyone should access.

3. Dependencies point the right way - I'm reading `system_dependencies` as this system needs these others. If it actually means the opposite, my entire graph is backwards.

4. Broken links don't matter - When a system references a dependency that doesn't exist, I just skip it. In the production app, this would show these orphaned connections or at least validate the data.

5. Every `fides_key` is unique - If two systems somehow share the same key, the second one overwrites the first. I'm banking on these IDs being truly unique.

6. This is a snapshot in time - I'm not tracking changes, version history, or who modified what when. It's just the current state.

7. Data subjects get simplified - Systems can process different data types for different groups (employees vs customers), but I'm flattening this, which loses some nuance about what applies to whom. For example, a system might process both employee and customer data, but I'm showing it as a single data subject.

### Tradeoffs 

1. Filters don't play nice together: The `Data Use` filter works on privacy declarations while other filters work on system properties. You can pick valid values for each and still get zero results. Should've made the relationships clearer.

2. Filters get slow with lots of data: Every time you change a filter, I loop through everything. Fine for under 200 systems but beyond that I'd need indexing or caching or even pagination to handle the large datasets.

3. No persistence layer: Not using any persistence layer to store the filter state. I could use URL parameters or localStorage or use a library like Jotai, Zustand, Redux, etc. but I prioritized other features.

4. Type checking is not validated: With hard coding the sample data and importing as `const`, I'm losing out on validating the types at runtime. In the production app, I would use Zod to validate the data types so there are no leaks or incorrect type declarations.

5. Lost some relationship details: I simplified how systems connect to privacy declarations and data categories. Now you can't ask "which exact declaration links system 'Application' to data category 'Email Marketing'?"

6. No WCAG compliance: The UI doesn't follow the WCAG guidelines for accessibility. This is a trade-off I made to prioritize the functionality and the user experience over the accessibility.

## Unique features I've added 

1. I've added a side panel in the dialog to show the system details including the description, type, data categories, data subjects and privacy declarations. This is not usually present in the typical data flow diagrams especially in a dialog. Dialogs are meant to be minimal and focused on the main content.

2. When clicking a node in the graph, the entire graph changes the context to the selected system and shows the dependencies and dependents of the selected system. Usually, the dialog would need to be closed to switch to another system. This is a more intuitive way to navigate the graph and see the relationships between systems. We're avoiding re-rendering of a lot of components to ensure the performance is not affected.

3. Added color coded nodes and edges to differentiate between the different system types and data flow directions. Ensuring the graph is more readable and easier to understand adding to the enhanced user experience. 

## Future Improvements

1. Unit Tests and Integration Tests: I would definitely add unit tests and integration tests to ensure the functionality and the user experience are not affected by the changes. Since, I am using bun with vite, I would use bun test for the unit tests and bun e2e for the integration tests.

2. Persistence Layer: I would use a library like Jotai, Zustand, Redux, etc. to store the filter state and the selected system. This would ensure the state is not lost when the page is refreshed or the user navigates away from the page.

3. Accessibility: Accessibility features are crucual for frontend applications that would I would definitely add to ensure the UI is compliant with the WCAG guidelines. This would make sure the UI is accessible to all users including those with disabilities.

4. Search: I would add search functionality to the UI to quickly find systems by name or description. This would ensure the user can quickly find the system they are looking for.

## FAQs

1. Why Bun over Node.js?

Bun has a much faster runtime than Node.js and is more efficient in terms of memory usage and performance. It also has a much smaller bundle size than Node.js. Additionally, Bun supports typescript out of the box which is a major advantage over Node.js. Node.js also brought native typescript support with the release of v25.4.0 but it has a lot of limitations and that influenced my decision to use Bun.

2. Why Bun with Vite instead of just Vite?

As Bun has the fastest runtime and is more efficient in terms of memory usage and performance, Vite is currently the most mature build tool which is lightweight, supports not just React but other frameworks and is fast and reliable with a lot of features and plugins. Additionally, Bun has a built-in support for Vite which makes it easier to use and configure. Again influencing my decision to use Bun with Vite.

3. Why React Flow for the graph visualization?

I wanted to build my own graph visualization but that would've cost me a lot of time and effort. React Flow is a mature library that is well maintained and has a lot of features and plugins that were perfectly suitable for the requirements. 

4. Why Tailwind CSS for the styling?

I just prefer TailwindCSS now for styling as it's a lot convenient to style the components inline rather than maintaining a separate CSS file. Addtionally, TailwindCSS has Just-in-Time (JIT) mode which is a major advantage over other CSS frameworks and the community support it has is massive which is simply difficult to overlook. 


## Additional Comments

It is inevitable to use LLM generated code in 2026 and I've made use of it to some extent perhaps mainly with react-flow but that being said, I've also made sure to validate the code and the functionality and the user experience are not affected by the changes. I've also made sure to add comments to the code to explain the functionality and the purpose of the code.