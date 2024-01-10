export const findNodeById = (nodes, id) => {
    let final;
  
    function findNode(nodes, id) {
      nodes.forEach(n => {
        if (n.id === id) {
          final = n;
          return;
        }
        if (n.files) findNode(n.files, id);
      });
    }
  
    findNode(nodes, id);
  
    return final;
};