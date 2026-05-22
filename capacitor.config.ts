import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
appId: 'com.peterdillon.adforge',
appName: 'AdForge',
webDir: 'out',
server: {
url: 'https://ai-video-app-live.vercel.app',
cleartext: true
}
};

export default config;