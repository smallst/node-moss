const {get_ngrams,remove_noise, k_grams, get_language_info} = require('./preprocessing')
let ocaml_keywords =
  ["and", "as", "assert", "asr", "begin", "class", "constraint",
   "do", "done", "downto", "else", "end", "exception", "external",
   "false", "for", "fun", "function", "functor", "if", "in", "include",
   "inherit", "initializer", "land", "lazy", "let", "lor", "lsl", "lsr",
   "lxor", "match", "method", "mod", "module", "mutable", "new", "nonrec",
   "object", "of", "open", "or", "private", "rec", "sig", "struct", "then",
   "to", "true", "try", "type", "val", "virtual", "when", "while", "with",
   "Arg", "Array", "ArrayLabels", "Buffer", "Bytes", "BytesLabels", "Callback",
   "Char", "Complex", "Digest", "Ephemeron", "Filename", "Format", "Gc",
   "Genlex", "Hashtbl", "Int32", "Int64", "Lazy", "Lexing", "List",
   "ListLabels", "Map", "Marshal", "MoreLabels", "Nativeint", "Oo", "Parsing",
   "Printexc", "Printf", "Queue", "Random", "Scanf", "Set", "Sort",
   "Spacetime", "Stack", "StdLabels", "Stream", "String", "StringLabels",
   "Sys", "Uchar", "Weak", "failwith"]

let ocaml_spec_chars =
  ['!', '$', '%', '&', '*', '+', '-', '.', '/', ':', ';', '<',
   '=', '>', '?', '@', '^', '|', '~', '#', '"', '(', ')', ',',
   '[', ']', '{', '}']

let ocaml_comments_info = 
  {
    single_comment : "",
    multi_comment_start : "(*",
    multi_comment_end : "*)",
    nest: true,
    strings: true,
  }

let java_keywords =
  ["abstract", "continue", "for", "new", "switch", "assert", "default",
   "package", "synchronized", "boolean", "do", "if", "private", "this", "break",
   "double", "implements", "protected", "throw", "byte", "else", "import",
   "public", "throws", "case", "enum", "instanceof", "return", "transient",
   "catch", "extends", "int", "short", "try", "char", "final", "interface",
   "static", "void", "class", "finally", "long", "strictfp", "volatile",
   "float", "native", "super", "while", "Boolean", "Byte", "Character", "Class",
   "ClassLoader", "ClassValue", "Compiler", "Double", "Enum", "Float",
   "InheritableThreadLocal", "Integer ", "Long", "Math", "Number", "Object",
   "Package", "Process", "ProcessBuilder", "Runtime", "RuntimePermission",
   "SecurityManager", "Short", "StackTraceElement", "StrictMath", "String",
   "StringBuffer", "StringBuilder", "System", "Thread", "ThreadGroup",
   "ThreadLocal", "Throwable", "Void", "AbstractCollection", "AbstractList",
   "AbstractMap", "AbstractQueue", "AbstractSequentialList", "AbstractSet",
   "ArrayDeque", "ArrayList", "Arrays", "BitSet", "Calendar", "Collections",
   "Currency", "Date", "Dictionary", "EnumMap", "EnumSet", "EventListenerProxy",
   "EventObject", "FormattableFlags", "Formatter", "GregorianCalendar",
   "HashMap","HashSet", "Hashtable", "IdentityHashMap", "LinkedHashMap",
   "LinkedHashSet", "LinkedList", "ListResourceBundle", "Locale", "Objects",
   "Observable", "PriorityQueue", "Properties", "PropertyPermission",
   "PropertyResourceBundle", "Random", "ResourceBundle",
   "ResourceBundle.Control", "Scanner", "ServiceLoader", "SimpleTimeZone",
   "Stack", "StringTokenizer", "Timer", "TimerTask", "TimeZone", "TreeMap",
   "TreeSet", "UUID", "Vector", "WeakHashMap"]

let java_spec_chars =
  ['!', '$', '%', '&', '*', '+', '-', '.', '/', ':', ';',
   '<', '=', '>', '?', '^', '|',  '\"', '\'', '(', ')', ',', '[', ']',
   '{', '}', '~', '@']

let java_comments_info = 
  {
    single_comment : "//",
    multi_comment_start : "/*",
    multi_comment_end : "*/",
    nest: false,
    strings: true,
  }

let test_fun_str =
  `(* Hello World this is a comment *)
   (* (* This is a nested comment *) *)
   (* This is a multi line comment
      This is a multi line comment *)
   (* This is a multi line (* nested comment
      Wowie this is *) quite the comment *)
  let split_and_keep_on_spec_chars spec_chars str =
  let char_array = str_to_chr_arr str in
  (List.fold_left
    (fun acc_arr chr ->
       let str_of_chr = String.make 1 chr in
       if List.mem chr spec_chars then
         List.cons "" (List.cons str_of_chr acc_arr)
       else
         (* Hello I am yet another comment *)
         match acc_arr with
         | h::t -> (String.concat "" [h,str_of_chr])::t
         | [] -> failwith "Array should never be empty"
    )
    [""]
    char_array) |> List.filter (fun str -> str <> "") |> List.rev`

let expected_res_str =
    ["letvvv=letv=vvin(List.v(funvv->letv=String.v1vinifList.vvvthenList.v",
     "(List.vvv)elsematchvwith|v::v->(String.v[v,v])::v|[]->failwithv",
     ")[]v)|>List.v(funv->v<>)|>List.v"].join('')

let test_fun_str3 = "wow(*wow wow wow*)wow"

let expected_res_str3 = "vv"

let test_fun_str4 = "wow (* wow wow wow"

let expected_res_str4 = "v"

let test_fun_str5 =
  `/**
     * A DumbAI is a Controller that always chooses the blank space with the
     * smallest column number from the row with the smallest row number.
     */
    public class DumbAI extends Controller`

let expected_res_str5 = "publicclassvextendsv"

let test_fun_str6 =
  `// Note: Calling delay here will make the CLUI work a little more
    Hello World
    I am the World
    hahaha`

let expected_res_str6 = "vvvvvvv"

let test_fun_str7 =
  `package controller,

import java.util.ArrayList,
import java.util.List,

import model.Board,
import model.Game,
import model.Location,
import model.NotImplementedException,
import model.Player,

/**
 * A DumbAI is a Controller that always chooses the blank space with the
 * smallest column number from the row with the smallest row number.
 */
public class DumbAI extends Controller {

  public DumbAI(Player me) {
    super(me),
    // TODO Auto-generated constructor stub
    //throw new NotImplementedException(),
  }

  protected @Override Location nextMove(Game g) {
    // Note: Calling delay here will make the CLUI work a little more
    // nicely when competing different AIs against each other.

    // TODO Auto-generated method stub
    //throw new NotImplementedException(),

    Board b = g.getBoard(),
    // find available moves
    for (int row = 0,row<Board.NUM_ROWS,row++) {
      for(int col = 0,col<Board.NUM_COLS,col++) {
        Location loc = new Location(row,col),
        if (b.get(loc) == null) {
          delay(),
          return loc,
        }

      }
    }
    // wait a bit
    delay(),

    return null,
  }
}`

let ocaml_info = get_language_info("ocaml_info.json")
let java_info = get_language_info("java_info.json")
let python_info = get_language_info("python_info.json")
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

let assert_equal = (a, b) =>{
  let eq = JSON.stringify(a) == JSON.stringify(b);
  if(Array.isArray(a)) {
    eq = arrayEquals(a, b)
  }
  if (!eq) {
    console.log('not match!')
    console.log(JSON.stringify(a))
    console.log(JSON.stringify(b))
  }
  else {
    return 'success'
  }
}
let tests = {
  "k_grams_2" : () => assert_equal(k_grams("test", 3), ["tes", "est"]),
  "k_grams_1" : () => assert_equal(k_grams("Hello World", 5),
                      ["Hello", "ello ", "llo W", "lo Wo", "o Wor", " Worl", "World"]),
  "ocaml_keywords" : () => assert_equal(
    ocaml_info.keywords,
                           ocaml_keywords),
  "ocaml_spec_chars" : () => assert_equal(
                             ocaml_info.spec_chars, ocaml_spec_chars),
  "ocaml_comments_info" : () => assert_equal(
    ocaml_info.comment_info,
                                ocaml_comments_info),

  "java_keywords" : () => assert_equal(java_info.keywords, java_keywords),
  "java_spec_chars" : () => assert_equal(java_info.spec_chars, java_spec_chars),
  "java_comments_info" : () => assert_equal(
    java_info.comment_info,
                               java_comments_info),

  "remove_noise" :
  () => assert_equal(
    remove_noise(
      ocaml_comments_info,
      test_fun_str,
      ocaml_keywords, ocaml_spec_chars,
      false),
      expected_res_str),

  "remove_noise_3" :
  () => assert_equal
  (remove_noise(
    ocaml_comments_info,
    test_fun_str3,
    ocaml_keywords, ocaml_spec_chars,
    false),
      expected_res_str3),

  "remove_noise_4" :
  () => assert_equal
  (remove_noise(
    ocaml_comments_info,
    test_fun_str4,
    ocaml_keywords, ocaml_spec_chars,
    false),
      expected_res_str4),

  "remove_noise_5" :
  () => assert_equal
  (remove_noise(
    java_comments_info,
    test_fun_str5,
    java_keywords, java_spec_chars,
    false),
      expected_res_str5),

  "remove_noise_6" :
  () => assert_equal
  (remove_noise(
    java_comments_info,
    test_fun_str6,
    java_keywords, java_spec_chars,
    false),
      expected_res_str6),

  "remove_noise_7" :
  () => assert_equal
  (remove_noise(
    java_comments_info,
    "abc<=def",
    java_keywords, java_spec_chars,
    false),
      "v<=v"),

  "remove_noise_8" : () => assert_equal
  (remove_noise(
    ocaml_comments_info,
    "let x = \"(*\" in let y = 5 in \"*)\"",
    ocaml_keywords,ocaml_spec_chars,
    false),
      "letv=vinletv=5inv"),

  "remove_noise_9" :
  () => assert_equal
  (remove_noise(
    ocaml_comments_info,
    "let x = 'y'",
    ocaml_keywords,ocaml_spec_chars,
    false),
      "letv=v"),
}

for(const key in tests) {
  // if(key == 'remove_noise')
  console.log(key, "::", tests[key]())
}

  let template = {code: "count = 0;\n\ndef choose(collector):\n    global count\n    count += 1\n    return ['fire', 'water', 'earth'][count % 3]\n\ndef collectHandler(data):\n    unit = data.target\n    while True:\n        if unit.item:\n            unit.bring()\n        else:\n            fruit = unit.findNearestFruit()\n            if fruit:\n                unit.pick(fruit)\n\nhero.on('spawn-runner', collectHandler)\n\nhero.spawnCollector()\nhero.spawnCollector()\n\nwhile True:\n    if hero.fire > 3:\n        hero.cast('fire-arrow')\n    elif hero.water >= 4 and len(hero.findMyCollectors()):\n        hero.transform(hero.findMyCollectors()[0], 'runner')\n    elif hero.earth > 3:\n        hero.cast('earth-arrow')\n", language: 'python' }
let t2 = 
console.log(remove_noise(python_info.comment_info,
                         template.code,
                         python_info.keywords, python_info.spec_chars,
                        false))