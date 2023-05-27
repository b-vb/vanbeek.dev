
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
          "Add player": "Add player";
"Add score to player": "Add player score";
"Clear all player scores": "Restart game";
"Edit player": "Edit player";
"Edit score of player": "Edit player score";
"Remove player": "Remove player";
"Remove score of player": "Remove player score";
"Reset game": "Start new game";
"Update rounds": "Update rounds";
        };
        eventsCausingDelays: {

        };
        eventsCausingGuards: {
          "Game done": "";
        };
        eventsCausingServices: {

        };
        matchesStates: "Playing" | "Setting up game" | "Showing results";
        tags: never;
      }
