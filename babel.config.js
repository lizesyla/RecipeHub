module.exports = function (api) {
    
        api.cache(true);
        return {
          presets: ['babel-preset-expo'],
          plugins: [
            // Kjo është e domosdoshme për Expo Router
            require.resolve('expo-router/babel'),
          ],
        };
      };
    