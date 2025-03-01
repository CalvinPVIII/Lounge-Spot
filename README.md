# Lounge Spot

Lounge Spot, a full stack watch party web app:

Create private rooms for you and your friends to gather around the screen and enjoy your favorite YouTube videos or Twitch streams together.

With Lounge Spot, you can:

- Invite friends to join a private room using a unique link

- Chat with each other in real-time while watching your content

- Enjoy seamless video playback synchronization across all devices

- Use our intuitive interface to control play/pause, volume, and more

Built on top of a robust Flask API, WebSockets, and React/TypeScript front-end, Lounge Spot provides a smooth and reliable experience for you and your friends.

**Lounge Spot is currently under active development, with more features planned to be implemented at a later date**

Feel free to request additional features or report bugs on the [Issues page on Github](https://github.com/CalvinPVIII/Lounge-Spot/issues)

## [View on the web](https://loungespot.netlify.app/)

### Technologies Used

- Python
- Flask
- React
- TypeScript
- Node
- Material UI
- Socket.io
- Vite

### Local Setup Instructions

To view and host this website locally, follow these instructions:

**Make sure you have Node.js version 16 or greater installed on your system. If you do not, installation instructions can be found [here](https://nodejs.org/en/download/prebuilt-installer).**
**Make sure you have Python 3 installed on your system. If you do not, installation instructions can be found [here](https://www.python.org/downloads/)**

- Using terminal, navigate to where you want to save the project, and run the command `git clone https://github.com/CalvinPVIII/Lounge-Spot.git`.
- Once the project has been cloned, navigate to the root directory by running the command `cd Lounge-Spot`.
- Inside the root directory, navigate to the server directory by running the command `cd server`.
- Inside the server directory, install all requirements by running the command `pip install -r requirement.txt`.
- Navigate into the client directory by running the command `cd ../client`
- Inside the client directory, install all requirements by running the command `npm install`.
- Create a file called `.env` in the root of the client folder. The file should have the following contents: `VITE_SERVER_URL = "http://localhost:5000"`. If you are running the server locally on a different port, make sure to the change the port number.
- To run the client locally, run the command `npm run dev` inside the client folder. You'll find a link to the dev server in your terminal that you can copy and paste into your web browser.
- To run the server locally, run the command `python main.py` inside the server folder.

_The server can also be deployed via the included Dockerfile_

### License

This website is licensed under the GNU General Public License v3.0. You can find more information about the license [here](https://www.gnu.org/licenses/gpl-3.0.en.html).

If you encounter any bugs or unexpected behaviors, please [submit an issue on GitHub](https://github.com/CalvinPVIII/Lounge-Spot/issues).
