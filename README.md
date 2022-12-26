# rxfm-router

A barely functional router for [RxFM](https://github.com/alden12/rxfm).

## Examples

```tsx
const App = () => {
  // you can use JSX directly, return it from a function,
  // optionally with parameters, or use predefined components
  const routes = {
    "": <p>Home</p>,
    about: () => <p>About</p>,
    contact: ContactComponent,
    "user/:name": ({ name }) => <p>User named {name}</p>,
  };
  // just pass the routes to the router
  <div id="app">
    <Router routes={routes} />
  </div>;
};
```

```tsx
// nested routes are supported
const routes = {
  todos: TodosListComponent,
  "todos/:id": TodosListComponent,
};
// or equivalently:
const routes = {
  todos: {
    view: TodosListComponent,
    children: {
      ":id": TodosListComponent,
    },
  },
};
```
