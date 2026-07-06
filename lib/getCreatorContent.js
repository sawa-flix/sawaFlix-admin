export async function getCreatorContent() {
  return [
    {
      id: "1",
      title: "The Baobab Legend",
      description: "A traditional folklore from West Africa.",
      type: "story",
      status: "approved",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Traditional Drum Rhythms",
      description: "Cultural drum patterns and meanings.",
      type: "music",
      status: "pending",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Jollof Rice",
      description: "Classic West African dish recipe.",
      type: "food",
      status: "rejected",
      created_at: new Date().toISOString(),
    },
  ];
}