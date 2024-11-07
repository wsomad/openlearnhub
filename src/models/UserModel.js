class UserModel {
    constructor(uid, email, firstName, lastName, username) {
        this.uid = uid;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
    }

    toJSON() {
        return {
            uid: this.uid || null,
            email: this.email || null,
            firstName: this.firstName || null,
            lastName: this.lastName || null,
            username: this.username || null,
        };
    }

    static fromJSON(json) {
        return new UserModel(
            json.uid || null,
            json.email || null,
            json.firstName || null,
            json.lastName || null,
            json.username || null,
        );
    }
}

export default UserModel;
