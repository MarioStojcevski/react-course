const fetchProfile = async () => {
  const response = await fetch("https://api.github.com/users/mariostojcevski");

  return await response.json();
}

// IIFE - Immediately invoked function expression - cannot say await in global scope must be in async function
(async () => {
    const data = await fetchProfile();
    console.log(data);
})();