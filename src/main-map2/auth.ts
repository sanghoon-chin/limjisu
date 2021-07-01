let currentUser: (string | null) = null;

export const check = () => {
    const cookies = document.cookie.split(';')
    for (let data of cookies) {
        if (data.includes('username')) {
            currentUser = data.split('=')[1]
            break;
        }
    }
    if (currentUser) {
        return true
    } else {
        return false
    }
}

export const getCurrentUser = () => currentUser || ''