export function mapUserToState(payload) {
    return {
        uid: payload?.uid || null,
        email: payload?.email || null,
        firstName: payload?.firstName || null,
        lastName: payload?.lastName || null,
        username: payload?.username || null,
    };
}

export function handleAuthError(error) {
    // Handle and transform the error
    console.error('Authentication Error: ', error.message);
}
