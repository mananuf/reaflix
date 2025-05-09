import type { JSX } from "react";

const App = (): JSX.Element => {
  return(
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <h1 className="font-semibold">Find <span className="text-gradient capitalize">Movies</span> you'll Love </h1>
        </header>
      </div>
    </main>
  )
}

export default App;