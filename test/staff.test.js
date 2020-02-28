process.env.NODE_ENV = "test";
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const server = require("../server/server");
const Staff = require("../server/staff/staff.model");

describe("STAFF", () => {
  beforeEach(async () => {
    await Staff.deleteMany({});
  });

  describe("GET /", () => {
    it("#it returns the staff listing", async () => {
      const staff = [
        {
          firstname: "Orji",
          lastname: "Bright",
          username: "bright",
          staffId: "00001",
          password: "12345"
        },
        {
          firstname: "Orji",
          lastname: "Bright",
          username: "Naza",
          staffId: "00002",
          password: "12345"
        },
        {
          firstname: "Izukanne",
          lastname: "Patrick",
          username: "Spato",
          staffId: "00003",
          password: "12345"
        }
      ];
      await Staff.insertMany(staff);
      const res = await chai.request(server).get("/staff/");
      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(staff.length);
    });
  });

  describe("GET Login /staff/:id/:usrname/:pwd", () => {
    it("#it returns the staff with the passed 'id', 'username' and 'password'", async () => {
      const teacher = new Staff({
        firstname: "Joe",
        lastname: "Iloanya",
        username: "Joe",
        staffId: "00004",
        password: "12345"
      });

      await teacher.save();
      const res = await chai
        .request(server)
        .get(
          `/staff/${teacher.staffId}/${teacher.username}/${teacher.password}`
        );
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("username", teacher.username);
    });
  });

  describe("POST / add staff to listing", () => {
    it("#returns staff when the request body is valid (has all parameters)", async () => {
      const teacher = new Staff({
        firstname: "Joe",
        lastname: "Iloanya",
        username: "Joe",
        staffId: "00005",
        password: "12345"
      });

      const res = await chai
        .request(server)
        .post("/staff/")
        .send(teacher);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.a("object");
      expect(res.body).to.have.property(
        "username",
        teacher.username.toLowerCase()
      );
    });

    it("#return 404 when request body has a missing parameter (invalid)", async () => {
      const teacher = new Staff({
        firstname: "",
        lastname: "Iloanya",
        username: "Joe",
        staffId: "00006",
        password: "12345"
      });

      const res = await chai
        .request(server)
        .post("/staff/")
        .send(teacher);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.instanceof(Object);
    });
  });
});