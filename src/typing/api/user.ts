declare namespace userApi {
    interface IUserLoginRequest {
        phone: string;
        password: string;
    }

    interface IUserLoginResponse {
        "id": number
        "username": string
        "avatar": string
        "profile": string
        "user_role": string
        "tag_list": string[]
        "created_at": string
        "updated_at": string
    }
}