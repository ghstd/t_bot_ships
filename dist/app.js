"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const telegraf_1 = require("telegraf");
const filters_1 = require("telegraf/filters");
const helpers_1 = require("./helpers");
const envParsed = (0, dotenv_1.config)().parsed;
const bot = new telegraf_1.Telegraf(envParsed.TEL_TOKEN);
;
;
const usersDb = [];
let playersDb = [];
const fieldTemplate = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
let movesCount = 1;
bot.command('start', (ctx) => {
    const newUser = {
        name: ctx.from.first_name,
        id: ctx.from.id
    };
    if (usersDb.find((user) => user.id === newUser.id)) {
        ctx.reply('вы уже есть в списке бота', telegraf_1.Markup.removeKeyboard());
    }
    else {
        usersDb.push(newUser);
        ctx.reply('вы добавлены в список бота', telegraf_1.Markup.removeKeyboard());
    }
});
bot.command('invite', (ctx) => {
    const otherUsers = usersDb.filter((user) => user.id !== ctx.from.id);
    ctx.reply('выберите кого пригласить', telegraf_1.Markup.inlineKeyboard(otherUsers.map((user) => [telegraf_1.Markup.button.callback(user.name, `invite-${user.id}`)])));
});
bot.on((0, filters_1.callbackQuery)('data'), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [eventType, eventId] = ctx.callbackQuery.data.split('-');
    if (eventType === 'invite') {
        const invitingUser = usersDb.find((user) => { var _a; return user.id === ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id); });
        const invitedUser = usersDb.find((user) => user.id === parseInt(eventId));
        if (!invitedUser || !invitingUser) {
            ctx.reply('пользователь отсутствует');
            return;
        }
        ctx.editMessageText(`вы отправили приглашение ${invitedUser.name}`);
        bot.telegram.sendMessage(invitedUser.id, `${invitingUser.name} приглашает вас`, telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('принять', `inviteResolve-${invitingUser.id}`), telegraf_1.Markup.button.callback('отклонить', `inviteReject-${invitingUser.id}`)]
        ]));
    }
    if (eventType === 'inviteResolve') {
        const invitedUser = usersDb.find((user) => { var _a; return user.id === ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id); });
        const invitingUser = usersDb.find((user) => user.id === parseInt(eventId));
        if (!invitedUser || !invitingUser) {
            ctx.reply('пользователь отсутствует');
            return;
        }
        playersDb = [];
        const users = [invitingUser, invitedUser];
        users.forEach((user) => {
            playersDb.push({
                player: user,
                ready: false,
                playerField: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],
                targetField: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]
            });
        });
        ctx.editMessageText(`вы приняли приглашение от ${invitingUser.name}`, telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('начать', 'startGame')]
        ]));
        bot.telegram.sendMessage(invitingUser.id, `${invitedUser.name} принял ваше приглашение`, telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('начать', 'startGame')]
        ]));
    }
    if (eventType === 'inviteReject') {
        const invitedUser = usersDb.find((user) => { var _a; return user.id === ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id); });
        const invitingUser = usersDb.find((user) => user.id === parseInt(eventId));
        if (!invitedUser || !invitingUser) {
            ctx.reply('пользователь отсутствует');
            return;
        }
        ctx.editMessageText(`вы отклонили приглашение от ${invitingUser.name}`);
        bot.telegram.sendMessage(invitingUser.id, `${invitedUser.name} отклонил ваше приглашение`);
    }
    if (eventType === 'startGame') {
        yield ctx.editMessageText('сделайте расстановку:');
        const playerField = (_a = playersDb.find((player) => { var _a; return player.player.id === ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id); })) === null || _a === void 0 ? void 0 : _a.playerField;
        if (!playerField) {
            ctx.reply('контекст неизвестен');
            return;
        }
        ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${playerField
            .map((item) => item
            .map((i) => '-')
            .join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
            .join('\n')}</pre>`, telegraf_1.Markup.keyboard(playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))));
    }
    if (eventType === 'playerReady') {
        yield ctx.reply('ожидайте', telegraf_1.Markup.removeKeyboard());
        if (playersDb.every((player) => player.ready)) {
            const playerIndex = (0, helpers_1.whoseMove)(movesCount);
            movesCount++;
            if (!playerIndex) {
                return;
            }
            const movingPlayer = playersDb[playerIndex];
            const waitingPlayer = playersDb.find((player) => player.player.id !== playersDb[playerIndex].player.id);
            if (movingPlayer && waitingPlayer) {
                ctx.telegram.sendMessage(waitingPlayer.player.id, 'ход второго игрока');
                ctx.telegram.sendMessage(movingPlayer.player.id, 'ваш ход', telegraf_1.Markup.keyboard(movingPlayer.playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))));
            }
        }
    }
}));
bot.hears(fieldTemplate.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`)).flat(), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const coords = ctx.message.text.split('');
    const coord_1 = coords[0].charCodeAt(0) - 65;
    const coord_2 = parseInt(coords[1]);
    const player = playersDb.find((player) => player.player.id === ctx.from.id);
    const playerField = player === null || player === void 0 ? void 0 : player.playerField;
    if (movesCount === 1) {
        if (player) {
            if (player.ready) {
                ctx.reply('вы уже выполнили расстановку');
                return;
            }
        }
        if (!playerField) {
            ctx.reply('контекст неизвестен');
            return;
        }
        if (playerField[coord_1][coord_2] === 1) {
            playerField[coord_1][coord_2] = 0;
        }
        else {
            playerField[coord_1][coord_2] = 1;
        }
        const checkResult = (0, helpers_1.checkField)(playerField);
        if (!checkResult.status) {
            yield ctx.reply(checkResult.message);
            ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${playerField
                .map((item) => item
                .map((i) => i === 1 ? '&' : '-')
                .join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
                .join('\n')}</pre>`, telegraf_1.Markup.keyboard(playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))));
        }
        else {
            player.ready = true;
            yield ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${playerField
                .map((item) => item
                .map((i) => i === 1 ? '&' : '-')
                .join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
                .join('\n')}</pre>`, telegraf_1.Markup.removeKeyboard());
            yield ctx.reply(checkResult.message, telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('сохранить', 'playerReady')]
            ]));
        }
    }
    else {
        console.log(ctx.from.first_name);
        console.log('from: ', ctx.from.id);
        console.log('chat: ', ctx.chat.id);
        const playerIndex = (0, helpers_1.whoseMove)(movesCount);
        if (!playerIndex) {
            return;
        }
        const movingPlayer = playersDb[playerIndex];
        const waitingPlayer = playersDb.find((player) => player.player.id !== playersDb[playerIndex].player.id);
        console.log(0); //!
        if (movingPlayer && waitingPlayer) {
            console.log(1); //!
            if (ctx.from.id === movingPlayer.player.id) {
                ctx.reply('сейчас не ваш ход');
                return;
            }
            movesCount++;
            switch (movingPlayer.playerField[coord_1][coord_2]) {
                case 0:
                    movingPlayer.playerField[coord_1][coord_2] = 2;
                    waitingPlayer.targetField[coord_1][coord_2] = 2;
                    break;
                case 1:
                    movingPlayer.playerField[coord_1][coord_2] = 3;
                    waitingPlayer.playerField[coord_1][coord_2] = 3;
                    break;
                default:
                    break;
            }
            const shipsQuantity = movingPlayer.playerField
                .reduce((result, item) => item
                .reduce((subResult, subItem) => subItem === 1 ? subResult + subItem : subResult, 0) + result, 0);
            if (shipsQuantity === 0) {
                ctx.telegram.sendMessage(movingPlayer.player.id, `
					игра завершена,
					победил ${waitingPlayer.player.name}
					количество ходов ${movesCount}
				`, telegraf_1.Markup.removeKeyboard());
                ctx.telegram.sendMessage(waitingPlayer.player.id, `
					игра завершена,
					победил ${waitingPlayer.player.name}
					количество ходов ${movesCount}
				`, telegraf_1.Markup.removeKeyboard());
                playersDb = [];
                movesCount = 1;
                return;
            }
            console.log(2); //!
            ctx.telegram.sendMessage(waitingPlayer.player.id, 'ход второго игрока', telegraf_1.Markup.removeKeyboard());
            ctx.chat.id = movingPlayer.player.id;
            console.log(ctx.chat.id);
            yield ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${movingPlayer.playerField
                .map((item) => item
                .map((i) => {
                switch (i) {
                    case 0:
                        return '-';
                    case 1:
                        return '&';
                    case 2:
                        return 'o';
                    case 3:
                        return 'x';
                    default:
                        return '?';
                }
            })
                .join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
                .join('\n')}</pre>`, telegraf_1.Markup.keyboard(movingPlayer.playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))));
            yield ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${movingPlayer.targetField
                .map((item) => item
                .map((i) => {
                switch (i) {
                    case 0:
                        return '-';
                    case 1:
                        return '&';
                    case 2:
                        return 'o';
                    case 3:
                        return 'x';
                    default:
                        return '?';
                }
            })
                .join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
                .join('\n')}</pre>`);
        }
    }
}));
//=========================================================
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
