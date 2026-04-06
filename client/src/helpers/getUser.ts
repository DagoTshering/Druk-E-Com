export const getUserFromLocalStorage = (): any => {
  try {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : ({} as any);
  } catch (error) {
    return {} as any;
  }
};
