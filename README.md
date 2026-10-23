# Calma Kombucha · Web y suscripción

Web estática (HTML, CSS y JS, sin dependencias) para vender kombucha:

- **Pedidos sueltos**: el cliente elige sabores y cantidades y envía el pedido por WhatsApp con el total, la dirección y las notas ya rellenados.
- **Club Calma (suscripción)**: planes semanal, quincenal y mensual. Cada plan enlaza a un *Payment Link* de Stripe con cobro recurrente; si aún no tienes Stripe, el botón abre WhatsApp con la solicitud de alta.

## 1. Personalizar

Todo se edita en **`assets/config.js`**:

| Campo | Qué es |
|---|---|
| `whatsapp` | Tu número con prefijo de país, solo dígitos (`34600123456`) |
| `email`, `zonaReparto` | Contacto y zona de reparto |
| `pedidoMinimo`, `costeEnvio`, `envioGratisDesde` | Reglas de envío de los pedidos sueltos |
| `sabores` | Nombre, descripción, precio y color de cada sabor. `disponible: false` lo marca como agotado |
| `planes` | Botellas, frecuencia y precio de cada plan, más su `stripeLink` |
| `stripePortal` | Enlace al portal de cliente de Stripe (opcional) |

Los precios y datos de contacto que trae ahora son **de ejemplo**: cámbialos antes de publicar.

## 2. Activar el cobro de suscripciones con Stripe

1. Crea una cuenta en [stripe.com](https://stripe.com) y activa los pagos.
2. En **Catálogo de productos**, crea un producto por plan (p. ej. "Club Calma Quincenal") con **precio recurrente** (cada semana, cada 2 semanas o mensual).
3. En **Payment Links**, crea un enlace para cada producto. Activa **"Recopilar dirección de envío"** y **"Recopilar número de teléfono"**.
4. Pega cada enlace en el `stripeLink` de su plan en `config.js`.
5. (Opcional) Activa el **Portal del cliente** en Configuración → Facturación y pega su enlace en `stripePortal`, para que los socios puedan pausar o cancelar ellos mismos.

Stripe te avisa por email de cada nueva suscripción y de cada cobro, así que la lista de repartos sale del panel de Stripe.

## 3. Ver la web en local

Abre `index.html` en el navegador, o:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 4. Publicar gratis en GitHub Pages

1. Fusiona estos cambios en `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada push a `main` publica la web automáticamente (workflow `.github/workflows/pages.yml`).
4. Para usar un dominio propio (p. ej. `calmakombucha.com`), añádelo en **Settings → Pages → Custom domain**.

## Aviso

Antes de vender, revisa los requisitos de tu país para elaborar y vender bebidas fermentadas (registro sanitario, etiquetado y alérgenos) y añade las páginas legales que correspondan (aviso legal, privacidad y condiciones de venta).
