using ReactPOC.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;

namespace ReactPOC.Helpers
{
    public static class EmailHelper
    {
        public static bool EnviarEmail(Expositores expositor)
        {
            try
            {
                string mailAccount = "estampillas@2r-it.com";

                string mailPassword = "AmDc0927";
                string mailHost = "dtcwin003.ferozo.com";
                int mailPort = 25;
                string mailIdentification = "Eventos SSR";
                bool mailSecure = false;

                //var attachTemp = QRHelper.GenerateQRCodeImage(estampilla.EstampillasCaja.UrlQR);
                //MemoryStream attachment = attachTemp;
                //string attachmentName = "estampilla.jpeg";
                MemoryStream attachment = null;
                string attachmentName = "";

                MailMessage mail = new MailMessage(
                    from: mailAccount,
                    to: expositor.Email,
                    subject: "Evento: " + expositor.id_eventoNavigation.NombreEvento,
                    body: "<h1>Acceso Confirmado</h1>Estimado/a: <b>" + expositor.Apellido + ", " + expositor.Nombre + "</b> (" + expositor.DNI + "). <br/>" +
                    "<p>Informamos a usted que fue habilitado para ingresar al evento.<br/>Recuerde que el ingreso al mismo es a través de su DNI, exclusivamente.<br/>" +
                    "Su acceso es de tipo: " + expositor.id_tipoIngresoNavigation.Tipo + ".<br/>Acceso Confirmado - No responda este correo.<br/>Multiple valido para todos los días - Unico es un solo ingreso..<br/>Muchas gracias.</p>")
                {
                    From = new MailAddress(address: mailAccount, displayName: mailIdentification),
                    IsBodyHtml = true
                };



                //// Add attach file
                if (attachment != null && !string.IsNullOrEmpty(attachmentName))
                {
                    System.Net.Mime.ContentType ct = new System.Net.Mime.ContentType(System.Net.Mime.MediaTypeNames.Image.Jpeg);
                    Attachment attach = new Attachment(attachment, attachmentName, ct.MediaType);
                    mail.Attachments.Add(attach);
                }

                SmtpClient client = new SmtpClient
                {
                    Host = mailHost,
                    Port = mailPort,
                };

                if (mailHost == "localhost")
                {
                    client.UseDefaultCredentials = true;
                }
                else
                {
                    NetworkCredential credential = new NetworkCredential(mailAccount, mailPassword);
                    if (mailSecure)
                        client.EnableSsl = true;
                    client.UseDefaultCredentials = false;
                    client.Credentials = credential;
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;
                }

                client.Send(mail);
                return true;
            }
            catch (Exception e)
            { return false; }
        }
    }
}
