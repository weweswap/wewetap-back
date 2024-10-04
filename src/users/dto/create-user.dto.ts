export class CreateUserDto {
    readonly id: string
    readonly first_name?: string
    readonly last_name?: string
    readonly username?: string
    readonly language_code?: string
    readonly ref ?: string
}