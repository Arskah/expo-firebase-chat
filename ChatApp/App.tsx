// Import the screens
import Main from './src/components/Main';
import Chat from './src/components/Chat';
// Import React Navigation
import { createStackNavigator } from 'react-navigation'

// Create the navigator
const navigator = createStackNavigator({
  Main: { screen: Main },
  Chat: { screen: Chat },
});

// Export it as the root component
export default navigator
