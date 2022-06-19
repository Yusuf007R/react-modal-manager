export const devLog = (message: string, error = false) => {
  if (process.env.NODE_ENV !== 'production') {
    if (error) return console.error(message);
    console.warn(message);
  }
};

export {};
