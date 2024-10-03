# RelayBox | Kickstart realtime web and mobile applications

RelayBox is a high-perfomance, developer-focused platform designed to accelerate realtime web and mobile app development. Get your free API key today to power up your applications and services.

View the <a href="https://relaybox.net/docs/api-reference/relaybox" target="blank">full technical documentation</a>.

The purpose of this library is to install the RelayBox CLI, which is designed to orchestrate the offline platform emulator.

With this emulator, you can replicate the full <a href="https://relaybox.net" target="blank">RelayBox</a> environment locally, allowing you to test and develop your applications without needing access to the live platform. It simplifies the process by managing the setup and coordination of all necessary services, so you can focus on building and refining your app with confidence.

<h2 id="install-relaybox">Installation</h2>

The `relaybox` package is distributed via npm and can be installed using the following command:

```
npm install -g relaybox
```

Once the library has been successfully installed, the following API reference applies.

---

<h2 id="connecting-to-the-platform">Connecting to the platform</h2>

The offline platform emulator is intended for use alongside <a target="blank" href="https://relaybox.net/docs/api-reference/relaybox-client">RelayBox Client</a> and <a target="blank" href="https://relaybox.net/docs/api-reference/relaybox-rest">RelayBox REST</a> SDKs. To connect to the offline platform, simply initialize a new instance of the RelayBox class, setting the `offline` options as follows.

```
import { RelayBox } from '@relaybox/client';

const relayBox = new RelayBox({
  publicKey: 'Your public key',
  offline: {
    enabled: true, // Required
    port: 3000, // Optional port override based on config settings
  }
});
```

---

<h2 id="relaybox-platform-configure">platform configure</h2>

Provides options for configuring application and db ports alongside logging levels. By default, the exposed platform services will run on the following ports:

- proxy: 9000
- db: 9001

Using a logging level of `debug` which will output all logs without any filtering. To customize these settings, simply run:

```
relaybox platform configure
```

Follow the prompts to configure your platform.

> REMEMBER: Be sure to run `relaybox platform up` to sync configuration changes.

---

<h2 id="relaybox-platform-up">platform up</h2>

Responsible for pulling Docker container images and bootstrapping the database in preparation to connect and run applications.

```
relaybox platform up
```

Running `relaybox platform up` will start the offline platform emulator.

---

<h2 id="relaybox-platform-down">platform down</h2>

Responsible for stopping any running Docker containers.

```
relaybox platform down
```

---

<h2 id="relaybox-application-create">application create</h2>

Creates an application and provides a `publicKey` and `apiKey` for use with the <a target="blank" href="https://relaybox.net/docs/api-reference/relaybox-client">client</a> and <a target="blank" href="https://relaybox.net/docs/api-reference/relaybox-rest">rest</a> sdk libraries.

```
relaybox application create
```

A prompt will appear asking you to choose a name for your application. Once you've created an application, you will be provided with a `publicKey` and `apiKey` for use with the <a target="blank" href="https://relaybox.net/docs/api-reference/relaybox-client">client</a> and <a target="blank" href="https://relaybox.net/docs/api-reference/relaybox-rest">rest</a> sdk libraries.

**Output:**

```
{
  "id": "gyyeqecxuhuz",
  "publicKey": "gyyeqecxuhuz.wotylbxdurq5",
  "apiKey": "gyyeqecxuhuz.wotylbxdurq5:b9d1d981b50991964461b92722b6c5"
}
```

---

<h2 id="relaybox-oauth-enable">oauth enable</h2>

Enable an oauth provider for use with the <a target="blank" href="https://relaybox.net/docs/api-reference/relaybox-client/auth#auth-signin-with-oauth">live auth</a> service.

```
relaybox oauth enable
```

---

<h2 id="relaybox-oauth-disable">oauth disable</h2>

Disable an oauth provider for use with the <a target="blank" href="https://relaybox.net/docs/api-reference/relaybox-client/auth#auth-signin-with-oauth">live auth</a> service.

```
relaybox oauth disable
```

---

<h2 id="relaybox-auth-reset-password">auth reset-password</h2>

Outputs a 6 digit verification code following a password reset request via <a target="blank" href="https://relaybox.net/docs/api-reference/relaybox-client/auth#auth-password-reset">live auth</a>

```
relaybox auth reset-password
```
