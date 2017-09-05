package com.sap.pia.producer;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Statement;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OdataDataDao
{
	private DataSource dataSource;
	private static final Logger LOGGER= LoggerFactory.getLogger(OdataDataDao.class);

	public OdataDataDao() throws NamingException
	{
		//InitialContext ctx= new InitialContext();
		//dataSource= (DataSource)ctx.lookup("java:comp/env/jdbc/dataSource");
	}

	/**
	 * @return * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	public Connection getConnection() throws ClassNotFoundException, SQLException
	{
		Connection connection= DriverManager.getConnection("jdbc:sap://10.97.148.80:30015/?autocommit=false","DEVX_25","Test1234");  
		return connection;
	}

	/**
	 * @param sqlText
	 * @param connection
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	void runSQL(String sqlText, Connection connection) throws ClassNotFoundException, SQLException, SQLIntegrityConstraintViolationException
	{
		Statement stmt= null;
		try
		{
			// prepare stmt
			stmt= connection.createStatement();

			// run it
			stmt.executeUpdate(sqlText);
		}
		finally
		{
			OdataUtility.safeClose(stmt);
		}
	}

	/**
	 * @param sqlText
	 * @param connection
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	boolean isProductExist(String productName, Connection  connection) throws ClassNotFoundException, SQLException, SQLIntegrityConstraintViolationException
	{
		ResultSet rs = null;
		Statement stmt = null;
		String sqlText = "SELECT PRODUCTNAME from SAP_PIA_USAGECLOUD.APPLICATION where PRODUCTNAME = '" + productName + "'";
		
		try
		{
			// prepare stmt
			stmt = connection.createStatement();
			
			// run it
			rs = stmt.executeQuery(sqlText);
			
			if(rs.next()) {
				return true;					
			}
			else {				
				return false;
			}
		}
		finally
		{
			OdataUtility.safeClose(stmt);
		}
	}

	/**
	 * @param sqlText
	 * @param connection
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	String executeSelectQuery(String sqlText, Connection  connection) throws ClassNotFoundException, SQLException, SQLIntegrityConstraintViolationException
	{
		ResultSet res = null;
		Statement stmt = null;
		String tableData = "";
				
		try
		{
			// prepare stmt
			stmt = connection.createStatement();
			
			// run it
			res = stmt.executeQuery(sqlText);
			
			while(res.next())
			{
				tableData+= res.getString(1) + " ";
				tableData+= res.getString(2);
				tableData+= ",";
			}
			return tableData;
		}
		finally
		{
			OdataUtility.safeClose(stmt);
			OdataUtility.safeClose(res);
			
		}
	}

}
