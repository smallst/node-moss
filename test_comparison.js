const {make_pair_comp,intersection,compare, create_sim_list, create_pair_sim_list} = require('./comparison')

let emp_file = {}
let se_dict =  {"a": [[1, 0]]}

let de_dict = {"a": [[1, 0], [2, 0]], "b": [[1, 0], [3, 0]]}
let def_p_comp = {a: [[1, 0], [2, 0]], b: [[1, 0]]}

let emp_e_dict = {a: [], b: [[7, 0], [4, 0]], c: [[4,0],[8,0],[13, 0]]}
let des_p_comp = {a:[[1,0]], b:[[1,0],[3,0]]}
let emp_e_f_p_comp = {a:[], b: [], c: []}
let emp_e_s_p_comp = {a:[], b: [[7,0], [4, 0]], c:[[4, 0]]}
let emp_e_t_p_comp = {a:[], b:[[4,0]], c:[[4,0],[8,0],[13,0]]}

let emp_comp = {}
let se_comp = {a: se_dict}
let def_comp = {a: def_p_comp}
let de_comp = {a: def_p_comp, b: des_p_comp}
let emp_e_comp = {a: emp_e_f_p_comp, b: emp_e_s_p_comp, c: emp_e_t_p_comp}
let get_files = (f) => f.map(([k,s]) => { return k})




function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

let assert_equal = (a, b) =>{
  let eq = JSON.stringify(a) == JSON.stringify(b);
  if (!eq) {
    console.log('not match!')
    console.log(JSON.stringify(a))
    console.log(JSON.stringify(b))
  }
  else {
    return 'success'
  }
}

let filedict_equal = (d1,d2) => assert_equal( Object.entries(d1), Object.entries(d2))
let compdict_equal= (d1, d2) => assert_equal(Object.entries(d1), Object.entries(d2))


let tests = {

  /* The test cases for intersection has cases that test what happens with
   * one or more empty lists, single element lists, 2 lists with the order
   * reversed, lists with elements of same hash but different position,
   * and lists with different number of elements, which are all the edge
   * cases, and then a couple of general cases. */
  "empty lists" : () => assert_equal([], intersection([],[])),
  "one list empty" : () => assert_equal([], intersection([[12,7],[9,13]], [])),
  "single lists uneq" :   () => assert_equal([], intersection([[1,0]], [[2,0]])),
  "single lists eq" : () => assert_equal([[1,0]], intersection([[1,0]],[[1,0]])),
  "diff order" : () => assert_equal([[1,0],[2,0]],intersection([[1,0],[2,0]],[[2,0],[1,0]])),
  "second order" : () => assert_equal([[2,0],[1,0]], intersection([[2,0],[1,0]],[[1,0],[2,0]] )),
  "diff pos" : () => assert_equal([[1,3],[2,1]],intersection([[1,3],[2,1]],[[2,2],[1,5]])),
  "diff number of elems" : () => assert_equal([[1,0],[2,1]],intersection([[1,0],[7,3],[2,1],[4,3]],
                                     [[2,2],[1,5]])),
  "simp case" : () => assert_equal([[1,0],[2,0]],intersection([[3,0],[1,0],[2,0]], [[2,0],[1,0]])),
  "long case" : () => assert_equal([[41,0],[20,0],[7,0],[53,0]],intersection([[82,0],[23,0],[46,0],[93,0],[41,0],[20,0],
                                                                              [47,0],[7,0],[84,0],[53,0]],
                         [[80,0],[42,0],[41,0],[53,0],[72,0],[7,0],[20,0],[100,0]])),


  /* The test cases for make_pair_comp test if the function works on an,
   * empty file, on a single entry file dictionary, if it works correctly for
   * either part of a double entry file dictionary with the corresponding
   * changes, and if it works if one of the entries in a file dictionary
   * is empty, which are all the edge cases. */
  "empty file" : () => filedict_equal(emp_file,
                                      make_pair_comp("", [])),
  "single entry" : () => filedict_equal(se_dict,
                                        make_pair_comp("a", [["a",[[1,0]]]])),
  "double entry first" : () => filedict_equal(def_p_comp,
                                              make_pair_comp("a", Object.entries(de_dict))),
  "double entry second" : () => filedict_equal(des_p_comp,
                                               make_pair_comp("b", Object.entries(de_dict))),
  "empty entry in file" : () => filedict_equal(emp_e_f_p_comp,
                                               make_pair_comp("a", Object.entries(emp_e_dict))),
  "empty entry second" : () => filedict_equal(emp_e_s_p_comp,
                                              make_pair_comp( "b", Object.entries(emp_e_dict))),
  "empty entry third" : () => filedict_equal(emp_e_t_p_comp,
                                             make_pair_comp( "c", Object.entries(emp_e_dict))),


  /* The test for compare test if it works on an empty file dictionary,
   * a single entry file dictionary, a double entry file dictionary,
   * and a file dictionary with an empty entry, which are all the edge
   * cases. */
  "empty comp" : () => compdict_equal(emp_comp,
                                      compare(emp_file)),
  "single entry comp" : () => compdict_equal(se_comp,
                              compare(se_dict)),
  "double entry comp" : () => compdict_equal(de_comp,
                              compare (de_dict)),
  "empty entry comp" : () => compdict_equal(emp_e_comp,
                             compare (emp_e_dict)),


  /* The test cases for create_sim_list test if the function works for
   * an empty comparison dictionary, one with a single entry, one with two
   * entries, and only with an empty entry, which are all the edge cases. */
  "empty sim" : () => assert_equal([],
                                   create_sim_list( emp_comp, {}, 0.5)),
  "single entry sim" : () => assert_equal([],
                                          create_sim_list(se_comp,se_dict, 0.5)),
  "double entry sim" : () => assert_equal(["a","b"],
                                          get_files(create_sim_list( de_comp, des_p_comp, 0.5 ))),
  "empty entry sim" : () => assert_equal(["b"],
                                         get_files(create_sim_list( emp_e_comp, emp_e_t_p_comp, 0.5 ))),


  /* The tests for create_pair_sim_list test if it works on an empty file
   * dictionary list, a single entry list, a double entry list for both entries
   * and for a list with an empty entry with every other filename than that of
   * of the one with the empty entry, since a precondition is that that case
   * will not work, which are all of the edge cases. */
  "empty pair" : () => assert_equal([],
                                    create_pair_sim_list( "", [])),
  "single entry" : () => assert_equal( [],
                                       create_pair_sim_list("a", Object.entries(se_dict))),
  "double entry first" : () => assert_equal([["b",0.5]],
                                            create_pair_sim_list( "a", Object.entries(def_p_comp))),
  "double entry second" : () => assert_equal([["a",0.5]],
                                             create_pair_sim_list( "b", Object.entries(des_p_comp))),
  "empty entry second" : () => assert_equal([["c",0.5],["a",0.0]],
                                            create_pair_sim_list("b" ,Object.entries(emp_e_s_p_comp))),
  "empty entry third" : () => assert_equal( ["b","a"],
                                            get_files(create_pair_sim_list("c", Object.entries(emp_e_t_p_comp)))),
}
for(const key in tests) {
  // if(key == 'remove_noise')
  console.log(key, "::", tests[key]())
}
