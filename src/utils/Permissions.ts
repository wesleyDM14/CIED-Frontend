interface RolePermissions {
    menus: string[];
    actions: string[];
}

const rolePermissions: Record<string, RolePermissions> = {
    ADMIN: {
        menus: ['/atendimento'],
        actions: [],
    },
    OPERATOR: {
        menus: ['/atendimento'],
        actions: [],
    }
}

export const hasPermission = (role: string, path: string): boolean => {
    const allowedRoutes = rolePermissions[role]?.menus || [];

    if (path.includes('/novo') && !allowedRoutes.some(route => route === path)) {
        return false;
    }

    if (allowedRoutes.includes(path)) {
        return true;
    }

    return allowedRoutes.some(route => {
        const dynamicRotue = route.replace(/:[^/]+/g, '([^/]+)');
        const regex = new RegExp(`^${dynamicRotue}`);
        return regex.test(path);
    });
};

export const hasActionPermission = (role: string, action: string): boolean => {
    return rolePermissions[role]?.actions.includes(action) ?? false;
}