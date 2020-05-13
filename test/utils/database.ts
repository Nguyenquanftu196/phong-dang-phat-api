import { MySQLClient } from "../../src/clients/mysql";
import { promises as fs } from 'fs';

export const setup = () => {
  return MySQLClient.sync({ force: true });
};

export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpcEFkZHJlc3MiOiI6OjEiLCJpcFR5cGUiOiJpcHY2IiwibGFuZyI6ImVuIiwiaWF0IjoxNTc5NTA4ODU1LCJ1c2VyIjp7ImlkIjoiNGYzNDM0ZWMtMzQ1Yi00NjIzLWEwYTctYzFiZDQwY2VkMmMzIiwidXNlcm5hbWUiOiJyb290IiwicGFzc3dvcmQiOiIkMmEkMTAkV3JVNklHSVMzcFhFMk1hVU8uV2ZuLjZwSk5FWVF1aHh5WDUvQzF2dGpVbnFHeUV4TUhRbVciLCJlbWFpbCI6bnVsbCwic3RhdHVzIjoiQUNUSVZFIiwidGVhbUlkIjpudWxsLCJjb250cmFjdE51bWJlciI6bnVsbCwiY29udHJhY3RFeHBEYXRlIjpudWxsLCJpc0FkbWluIjoxLCJjcmVhdGVkQXQiOiIyMDIwLTAxLTE1VDA5OjEwOjQxLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTAxLTE1VDA5OjEwOjQxLjAwMFoifX0.FVBokf4H11gNi5pOxHZC4ECJpLaH51SLFAOzbrKToKA';

export const tearup = async () => {
  const sql = (await fs.readFile(__dirname + '/../resources/setup.sql')).toString('utf8');
  return MySQLClient.query(sql);
}