import { Modal } from "./UI/Modal";
import { Map } from "./UI/Map";
import { getCoordsFromAddress } from "./Utility/Location";
import { getAddressFromCoords } from "./Utility/Location";

class Coordinate {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
}
class PlaceFinder {
  constructor() {
    this.addressForm = document.querySelector("form");
    this.locateUserBtn = document.querySelector("#locate-btn");
    this.shareBtn = document.getElementById("share-btn");
    this.shareLinkInputEle = document.getElementById("share-link");

    this.shareBtn.addEventListener("click", this.shareLinkHandler);
    this.addressForm.addEventListener("submit", findAddressHandler.bind(this));
    this.locateUserBtn.addEventListener("click", locateUserHandler.bind(this));

    function shareLinkHandler() {
      const shareLinkInputEle = document.getElementById("share-link");
      if (!navigator.clipboard) {
        shareLinkInputEle.select();
        return;
      }
      navigator.clipboard
      .writeText(shareLinkInputEle.value)
      .then(() => {
        alert("Copied to clipboard");
      })
      .catch((err) => {
        throw err;
        shareLinkInputEle.select();
        });
    }
    async function findAddressHandler(event) {
      event.preventDefault();
      const address = event.target.querySelector("input").value;
      if (!address || address.length === 0) {
        alert("invalid address - please try valid address");
      } else {
        const modal = new Modal("loading-modal-content", "Loading location...");
        modal.show();
        try {
          const coordinates = await getCoordsFromAddress(address);
          this.selectPlace(coordinates, address);
        } catch (error) {
          console.log(error.message);
        }
        modal.hide();
      }
    }
    async function locateUserHandler() {
      const modal = new Modal("loading-modal-content", "Loading location...");
      modal.show();
      if (!navigator.geolocation) {
        modal.hide();
        alert(
          "Your browser does not the support the location feature - use more modern browser or insert the address manually"
        );
      } else {
        navigator.geolocation.getCurrentPosition(
          async (successResult) => {
            modal.hide();
            const coord = new Coordinate(
              successResult.coords.latitude,
              successResult.coords.longitude
            );
            console.log(coord);
            const address = await getAddressFromCoords(coord);
            this.selectPlace(coord, address);
          },
          (errorResult) => {
            modal.hide();
            console.log(errorResult);
          }
        );
      }
    }
  }
  selectPlace(coordinates, address) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
    this.shareBtn.style.disabled = false;
    this.shareLinkInputEle.value = `${
      location.origin
    }/my-place/?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
      coordinates.lng
    }`;
  }
}

const placeFinder = new PlaceFinder();
