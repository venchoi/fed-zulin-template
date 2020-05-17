import { Client } from '@types/raven';
declare global {
    interface Window {
        Raven: Client;
    }
}
