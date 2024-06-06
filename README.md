# Lounge Spot

Web app for watching videos and more with friends

**Lounge Spot is currently under active development, and more information will be updated as development continues**

### Technologies Used

- Python
- Flask
- React
- TypeScript
- Node
- Material UI
- Web Sockets
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

### License

This website is licensed under the GNU General Public License v3.0. You can find more information about the license [here](https://www.gnu.org/licenses/gpl-3.0.en.html).

If you encounter any bugs or unexpected behaviors, please [submit an issue on GitHub](https://github.com/CalvinPVIII/calvindev-portfolio/issues).
