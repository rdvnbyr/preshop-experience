import {createAdminAPIClient} from '@shopware/api-client';

const adminAiClient = createAdminAPIClient({
    baseURL: process.env.NEXT_PUBLIC_SHOPWARE_ADMIN_ENDPOINT,
    credentials: {
        grant_type: 'client_credentials',
        client_id: process.env.NEXT_PUBLIC_SHOPWARE_ADMIN_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_SHOPWARE_ADMIN_CLIENT_SECRET!,
    }
    
})