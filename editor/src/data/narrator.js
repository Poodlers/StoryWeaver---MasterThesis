export let narrator = localStorage.getItem("characters")
  ? JSON.parse(localStorage.getItem("characters")).find((char) => char.id === 0)
  : {
      id: 0,
      name: "Narrador",
      description: "O narrador da história",
      image: {
        inputType: "url",
        filename: "../assets/character_dialogue_node.png",
        blob: null,
      },
    };
