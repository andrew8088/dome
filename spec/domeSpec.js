describe("dome", function () {
    describe("get", function () {
        it("can get elements by id", function () {
            var el = document.getElementById('one');
            expect(dome.get("#one")[0]).toEqual(el);
        });
        it("can get elements by class", function () {
            expect(dome.get(".two").length).toEqual(3);
        });

        it("can get elements by tag name", function () {
            expect(dome.get("b").length).toEqual(4);
        })
        it("creates a dome object from a single node", function () {
            var one = document.getElementById('one');
            expect(dome.get(one)[0]).toBe(one);
        });
        it("creates a dome object from a NodeList", function () {
            var two = $(".two").get();
            expect(dome.get(two)[0]).toBe(two[0]);
        });
    });

    describe("utils", function () {
        it("can loop over each element", function () {
            var o =  {
                loop: function (el) { }
            };
            spyOn(o, 'loop');
            dome.get("b").forEach(o.loop);

            expect(o.loop).toHaveBeenCalled();
        });

        it("can map over each element", function () {
            var a = dome.get("b").map(function (el) {
                return el.className;
            });
            expect(a.join('')).toEqual('twotwotwo');
        });
    });
    describe("text", function () {
        beforeEach(function () {
            this.d = dome.get("#one");
        });
        it("can set the text of an element", function () {
            this.d.text("one");
            expect(this.d[0].innerText).toEqual("one");
        });
        it("can get the text of an element", function () {
            this.d.text("one");
            expect(this.d.text()).toEqual("one");
        });
        afterEach(function () {
            this.d.text("");
        });
    });
