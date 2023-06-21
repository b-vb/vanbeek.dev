
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {

        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "Add blank scores": "Start game";
"Add player": "Add player";
"Clear all player scores": "Restart game";
"Edit player": "Edit player";
"Edit score of player": "Update player score";
"Increment active round": "Next round";
"Remove player": "Remove player";
"Reset game": "Start new game";
"Toggle rounds": "Toggle rounds";
"Update player total score": "Update player score";
"Update rounds": "Update rounds";
        };
        eventsCausingDelays: {

        };
        eventsCausingGuards: {
          "Game over when set rounds are played": "";
        };
        eventsCausingServices: {

        };
        matchesStates: "Playing" | "Setting up game" | "Showing results";
        tags: never;
      }
