<template>
  <div>
    <transition :appear="true" name="fade" mode="out-in" tag="div">
      <v-container v-if="form.show && !output.show" :key="1" fill-height grid-list-xl align-bottom justify-center>
        <v-flex xs12 sm12 md8 class="mt-5">
          <v-card class="pl-5 pt-2 pr-5">
            <v-card-text>
              <v-layout row xs2 sm2 md2>
                <v-flex xs4>
                  <v-text-field label="Title" v-model="form.title" placeholder="Untitled" :counter="50" :rules="[rules.max(50)]" :disabled="formDisabled"> </v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field :required="!!viewing" label="Note Password" v-model="form.password" :disabled="formDisabled"> </v-text-field>
                </v-flex>
                <v-flex v-if="!viewing" xs3 mt-2>
                  <v-btn flat @click="form.password = randomstr(21, true)" color="secondary">Random</v-btn>
                </v-flex>
              </v-layout>
              <v-layout row xs2 sm2 md2>
                <v-text-field required
                  label="Note"
                  v-model="form.note"
                  :disabled="formDisabled"
                  :rules="[rules.required]" 
                  :editable="!viewing"
                  multi-line>
                </v-text-field>
              </v-layout>
              <v-layout row>
                <v-flex xs3 sm3 md3 mt-1>
                  <v-btn v-if="!viewing" color="primary" @click="submit" :disabled="formDisabled || !form.note.length">Create</v-btn>
                  <v-btn v-else color="primary" @click="decrypt" :disabled="decrypted">Decrypt</v-btn>
                </v-flex>
                <v-flex>
                  <v-select v-if="!viewing" label="Expiration" :disabled="formDisabled" :items="exp_items" v-model="form.exp">
                  </v-select>
                  <v-btn v-else color="secondary" @click="resetForm"> Create a Note</v-btn>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex>
                  <transition name="fade" mode="out-in">
                  <v-alert v-if="!!form.error.message.length" :icon="form.error.icon" :value="!!form.error.message.length" :color="form.error.color" v-html="form.error.message"></v-alert>
                  </transition>
                </v-flex>
              </v-layout>

            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
      <v-container v-else-if="output.show && !form.show" :key="2" fill-height grid-list-xl align-bottom justify-center>
        <v-flex xs12 sm12 md8>
          <v-card>
            <v-card-title>
              <h3 class="display-1">Encrypted Note:</h3>
            </v-card-title>
            <v-card-text>
              <v-layout row>
                <v-flex xs2 sm2 md2>
                  <span class="code">Note URL:</span>
                </v-flex>
                <v-flex>
                  <span class="code">{{output.url}}</span>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs2 sm2 md2>
                  <span class="code">Password: </span>
                </v-flex>
                <v-flex>
                  <span class="code">{{form.password}}</span>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex>
                  <v-btn flat v-clipboard:copy="output.url + url_base64_encode(form.password)" v-clipboard:success="onCopySuccess" color="primary">Copy With Password</v-btn>
                  <v-btn flat v-clipboard:copy="output.url" v-clipboard:success="onCopySuccess" color="secondary">Copy Without Password</v-btn>
                  <v-btn flat @click="resetForm" color="accent">Create Another</v-btn>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex>
                  <transition name="fade" mode="out-in">
                  <v-alert v-if="copySuccess" icon="check_circle" :value="copySuccess" color="success">Copied to Clipboard</v-alert>
                  </transition>
                </v-flex>
              </v-layout>

            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </transition>
  </div>
</template>

<script>

import CryptoJS from 'crypto-js'

function randomstr (size, symbols) {
  var text = "";
  var charset = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890" 
  if(symbols === true){
    charset += "~_+-=)(*&^%$#@!{}[]";
  }
  for(var i = 0; i < size; ++i) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
}

export default {
  data: () => ({
    urls: {
      // DRY violation but this was an afterthought
      api: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api",
      note: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/#/",
    },
    copySuccess: false,
    formDisabled: false,
    viewing: false,
    decrypted: false,

    form: {
      show: false,
      error: {
        message: "",
        color: "",
        icon: "",
      },
      title: "",
      password: "",
      note: "",
      exp: 0,
    },

    output: {
      show: false,
      url: "",
    },

    exp_items: [
        {value: 0, text: "Single Use"},
        {value: 1, text: "5 minutes"},
        {value: 2, text: "20 minutes"},
        {value: 3, text: "1 hour"},
        {value: 4, text: "4 hours"},
        {value: 5, text: "24 hours"},
    ],

    rules: {
        required: value => !!value || "Required",
        min: size => val => val.length >= size || "At least " + size + " characters",
        max: size => val => val.length <= size || "At most " + size + " characters",
    },
  }),
  
  methods: {
      randomstr,

      url_base64_encode(text){
        return btoa(text).replace('+', '.').replace('/', '_').replace('=', '-')
      },

      url_base64_decode(text){
        return atob(text.replace('.', '+').replace('_', '/').replace('-', '='));
      },

      onCopySuccess () {
        console.log("Test");
        this.copySuccess = true;
      },


      decrypt () {
        if (this.decrypted === false) {
          var original;
          try{
            original = CryptoJS.AES.decrypt(this.form.note, this.form.password).toString(CryptoJS.enc.Utf8);
          } catch (ex){
            original = "";
          }

          if(original === "") {
            this.form.error.message = "Incorrect Password";
          } else {
            this.form.error.message = "";
            this.decrypted = true;
            this.form.note = original;
          }
        }
      },

      resetForm () {
        // disable output from creating a note
        this.output.show = false;

        // resetting the form brings us back to the note creation page. disable note viewing
        this.viewing = false;
        this.decrypted = false;

        // reset note values and show the form
        this.form.note = "";
        this.form.title = "";
        this.form.password = randomstr(21, true);
        this.form.show = true;

        // clear alerts and error messages        
        this.copySuccess = false;
        this.form.error.message = "";

        // go home
        this.$router.push('/');
      },

      submit () {
        var title = this.form.title || "Untitled";
        if(!this.form.note.length){
          return;
        }
        console.log(this.$el);
        let [t, p, n, e] = [this.form.title, this.form.password, this.form.note, this.form.exp]
        n = CryptoJS.AES.encrypt(n, p).toString();
        this.$http.post(this.urls.api + "/create", {title: t, note: n, expiration: e}).then(
          suc => {
            if (suc.status === 201){
              this.output.url = this.urls.note + suc.data.uid;
              this.form.show = false;
              this.output.show = true;
            }
          },
          err => {
            this.form.error.message = err.data.message;
            this.decrypted = true;
          }
        )
      }
  },

  mounted () {
    this.output.show = false;

    if(this.$route.path === '/'){
      this.form.show = true;
      return;
    }

    // assume we're viewing a note
    this.viewing = true;
    let uid = this.$route.path.substr(1, 21);

    // statically sied UID lengths
    if(uid.length != 21){
      this.form.error.message = "Invalid Note ID";
      this.form.error.icon = "warning";
      this.form.error.color = "error";
      this.form.show = true;
    }

    // anything after the initial ID is assumed to be the password.
    let pass = this.$route.path.substr(22, this.$route.path.length - 1);
    if (pass.length){
      try{
        pass = this.url_base64_decode(pass);
      } catch (ex) {
        console.log(ex);
        pass = "";
      }
    }

    this.form.password = pass;

    this.$http.post(this.urls.api + "/get", {"uid": uid}).then(
      suc => {
        if (suc.data.success === true){
          this.form.title = suc.data.title;
          this.form.note = suc.data.note;
          this.form.show = true;
        }
      },
      err => {
        this.form.error.message = err.data.message;
        this.form.note = "";
        this.form.show = true;
      }
    )
  }

}
</script>