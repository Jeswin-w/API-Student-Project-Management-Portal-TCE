
import axios from "axios";

export default {
    name: 'hello',
    data() {
      return {
        User: {},
      }
    },
    mounted() {
      axios.get('http://localhost:3100/dashboard')
        .then((response) =>{
        console.log(response.data);
        this.User = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },
  }

