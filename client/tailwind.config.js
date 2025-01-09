/** @type {import('tailwindcss').Config} */
// This JSDoc comment specifies the type of the configuration file and ensures that the file is correctly interpreted by Tailwind CSS.

module.exports = {
  // The module.exports exports the Tailwind CSS configuration, so it can be used by Tailwind during the build process.

  content: [
    // The content array specifies the paths to all files where Tailwind's classes will be used. Tailwind will purge unused CSS in production by scanning these files.
    "./src/*/.{js,jsx,ts,tsx}", 
    // This line tells Tailwind to scan all files within the src folder, including JavaScript, JSX, TypeScript, and TSX files.
  ],

  theme: {
    // The theme object allows you to extend or customize the default Tailwind CSS settings.

    extend: {
      // The extend property is used to add or override the default theme values without replacing them entirely.

      fontFamily: {
        // The fontFamily property allows you to define custom fonts that can be used in your application.

        velora: [
          // The "velora" font is custom-defined here. This is a list of fallback fonts in case the primary font is unavailable.
          '"Centra No2"', // Primary font
          '-apple-system', // Fallback for Apple devices
          'BlinkMacSystemFont', // Fallback for Blink-based browsers (e.g., Chrome)
          '"Segoe UI"', // Fallback for Windows
          'Roboto', // Fallback font
          '"Helvetica Neue"', // Another common sans-serif fallback
          'Arial', // Another common sans-serif fallback
          'sans-serif', // Generic fallback for sans-serif fonts
        ],
        
        Roboto: ['Roboto'], 
        // This defines the "Roboto" font family.
        
        Poppins: ['Poppins'], 
        // This defines the "Poppins" font family.

        Grotesk: ["Familjen Grotesk"]
        // This defines the "Familjen Grotesk" font family, which will be used as "Grotesk".
      },

      backgroundImage: {
        // The backgroundImage property allows you to define custom background images or gradients.

        'radial-logo': 'radial-gradient(circle, #FFD700, #68c9e9, #eaf7fc)', 
        // The 'radial-logo' background is a radial gradient with colors #FFD700, #68c9e9, and #eaf7fc.
        
        'radial-logo-vibrant': 'radial-gradient(circle, #48aadf, #00d4ff, #ffffff)', 
        // The 'radial-logo-vibrant' background is a vibrant radial gradient using shades of blue (#48aadf, #00d4ff) and white (#ffffff).
        
        'radial-logo-soft': 'radial-gradient(circle, #48aadf, #b3dffc, #ffffff)', 
        // The 'radial-logo-soft' background is a softer radial gradient using shades of blue (#48aadf, #b3dffc) and white (#ffffff).
      },
    },
  },

  plugins: [
    // The plugins array allows you to add custom plugins to extend Tailwind CSS functionality.
    // Currently, it's an empty array, meaning no additional plugins are used in this configuration.
  ],
};