import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppleEmail from './AppleEmail';

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <AppleEmail />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
