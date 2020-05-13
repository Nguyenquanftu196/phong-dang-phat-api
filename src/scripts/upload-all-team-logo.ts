import { promises as fs } from 'fs';
import { uniqBy, forEach, map, flattenDeep } from 'lodash';
import FileServices from '../../src/services/file';
import { COUNTRIES } from '../constants/country';
import { MySQLClient } from '../../src/clients/mysql';
import { getModels } from '../../src/models/db.tables';
import hl from 'highland';

const { PlayersTransfert, TeamsTransfermarkt } = getModels(MySQLClient);


export const uploadTeamLogo = async (teams: any, callback: Function) => {
  try {
    await FileServices.uploadTeamLogo(teams);
    console.log("+" + teams.length);
  } catch (error) {
    console.log(error)
  }

  callback();
}

export const uploadTournament = async (teams: any, callback: Function) => {
  try {
    await FileServices.uploadTeamLogo(teams);
    console.log("+" + teams.length);
  } catch (error) {
    console.log(error)
  }

  callback();
}

export const uploadLogo = async () => {
  try {

    let unexpectedError: any = null;
    console.log('starting...')

    const teams = await MySQLClient.query(
      'SELECT DISTINCT homeTeam AS teamName, homeTeamId AS teamId FROM matches_details',
      { type: MySQLClient.QueryTypes.SELECT });
    hl(teams)
      .batch(50)
      .map(hl.wrapCallback(uploadTeamLogo))
      .parallel(1)
      .stopOnError((error) => {
        unexpectedError = error;
      })
      .done(() => {
        if (unexpectedError) {
          console.log(unexpectedError);
          process.exit(1);
        } else {
          console.log('Done.');
          process.exit(0);
        }
      });
  } catch (e) {
    console.log(e);
  }
}

export const uploadTournamentLogo = async () => {
  try {

    let unexpectedError: any = null;
    console.log('starting...')

    const tournaments = await MySQLClient.query(
      'SELECT *  FROM tournaments_transfermarkt',
      { type: MySQLClient.QueryTypes.SELECT });
    hl(tournaments)
      .batch(50)
      .map(hl.wrapCallback(uploadTournament))
      .parallel(1)
      .stopOnError((error) => {
        unexpectedError = error;
      })
      .done(() => {
        if (unexpectedError) {
          console.log(unexpectedError);
          process.exit(1);
        } else {
          console.log('Done.');
          process.exit(0);
        }
      });
  } catch (e) {
    console.log(e);
  }
}

// export const uploadLogo = async () => {
//   try {
//     const teams = await MySQLClient.query(
//     'SELECT DISTINCT homeTeam AS teamName, homeTeamId AS teamId FROM matches_details',
//     { type: MySQLClient.QueryTypes.SELECT });

//     forEach(teams, async team => {
//       const logoUrl = `https://tmssl.akamaized.net//images/wappen/medium/${team.teamId}.png?lm=1458585362`;
//       await FileServices.uploadLogoFromUrl(team.teamId, logoUrl);
//     })
//   } catch (e) {
//     console.log(e);
//   }
// }

export const uploadTrophy = async () => {
  try {
    // const teams = await TeamsTransfermarkt.findAll({ raw: true });
    const sql = 'SELECT * FROM `players_transfermarkt` WHERE `listTrophy` NOT LIKE \'[]\'';
    const res = await MySQLClient.query(sql, { type: MySQLClient.QueryTypes.SELECT });
    const parsedItem = await Promise.all(map(res, r => {
      r.listTrophy = JSON.parse(r.listTrophy);
    }))
    const listTrophy = map(res, 'listTrophy');

    const uniqTitle = uniqBy(flattenDeep(listTrophy), 'name');
    // const listTrophy: any = [];
    // forEach(teams, (t: any) => {
    //   if (JSON.parse(t.listTrophy).length > 0) {
    //     listTrophy.push(JSON.parse(t.listTrophy))
    //   }
    // })
    // const uniqTitle = uniqBy(flattenDeep(listTrophy), 'name');
    await Promise.all(map(uniqTitle, (o: any) => {
      o.titleId = o.image.split('.png')[0].split('/')[7];
      return FileServices.uploadTitleFromUrl(o.titleId, o.image);
    }))
    // FileServices.uploadTitleFromUrl(168, 'https://tmssl.akamaized.net//images/erfolge/header/168.png?lm=1461847499');

  } catch (e) {
    console.log(e);
  }
}



export const uploadNationFlag = async () => {
  try {
    forEach(COUNTRIES, async (country: any) => {
      country.name = country.name.replace(/\s/g, '');
      await FileServices.uploadFlagFromUrl(country.name, `https://tmssl.akamaized.net//images/flagge/small/${country.id}.png`
      );
    })
  } catch (e) {
    console.log(e);
  }
}

let upload = 0;
export const uploadPlayerAvatar = async (uniqTitle: any, callback: Function) => {
  try {
    // const listTrophy: any = [];
    // forEach(teams, (t: any) => {
    //   if (JSON.parse(t.listTrophy).length > 0) {
    //     listTrophy.push(JSON.parse(t.listTrophy))
    //   }
    // })
    // const uniqTitle = uniqBy(flattenDeep(listTrophy), 'name');
    await Promise.all(map(uniqTitle, (o: any) => {
      o.titleId = o.image.split('.png')[0].split('/')[7];
      return FileServices.uploadTitleFromUrl(o.titleId, o.image);
    }))
  } catch (error) {
    console.log(error)
  }

  callback();
}

export const uploadAvatar = async () => {
  try {
    const sql = 'SELECT * FROM `players_transfermarkt` WHERE `listTrophy` NOT LIKE \'[]\'';
    const res = await MySQLClient.query(sql, { type: MySQLClient.QueryTypes.SELECT });
    await Promise.all(map(res, r => {
      r.listTrophy = JSON.parse(r.listTrophy);
    }))
    const listTrophy = map(res, 'listTrophy');

    const uniqTitle = uniqBy(flattenDeep(listTrophy), 'name');
    let unexpectedError: any = null;
    console.log('starting...')

    hl(uniqTitle)
      .batch(20)
      .map(hl.wrapCallback(uploadPlayerAvatar))
      .parallel(1)
      .stopOnError((error) => {
        unexpectedError = error;
      })
      .done(() => {
        if (unexpectedError) {
          console.log(unexpectedError);
          process.exit(1);
        } else {
          console.log('Done.');
          process.exit(0);
        }
      });
  } catch (e) {
    console.log(e);
  }
}

uploadAvatar();