
export const handleApiError = (err: unknown, label: string) => {
  let message = 'Something went wrong';

  if (err && typeof err === 'object' && 'message' in err) {
    message = (err as any).message;
  }

  console.error(`${label} error: ${message}`);
};
