const api_url = 'https://quizapi.io/api/v1/questions';
const api_token = 'FhM3bp5OFLJVGzVKTixObZW1ujf8ydXJBgLwM4Uo';

const categories = ["Linux", "DevOps", "bash", "CMS", "Code", "SQL", "Docker"];
const difficulties = ["Easy","Medium", "Hard"];
const amountOfQuestions = { min: 1, max: 20 };

const defaultPreferences = {
  category: "Linux",
  difficulty: "Easy"
};

export { api_url, api_token, categories, difficulties, amountOfQuestions, defaultPreferences };