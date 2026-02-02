export const UserRolesEnum = {
    ADMIN: "admin",
    PROJECT_ADMIN: "project admin",
    MEMBER: "member"
}

export const AvailableUserRole = Object.values(UserRolesEnum) 
// ["admin", "project admin", "member"]

export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done"
}

export const AvailableTaskStatus = Object.values(TaskStatusEnum) 